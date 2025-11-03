import NextAuth from "next-auth/next"
import FacebookProvider from "next-auth/providers/facebook"
import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "public_profile,email",
          display: "popup",
        }
      },
    }),
    // Thêm các provider khác nếu cần'
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Gọi API backend để xác thực
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });
        const data = await res.json();
        
        console.log('[NextAuth Credentials] Login response:', {
          ok: res.ok,
          hasToken: !!data.token,
          hasData: !!data.data,
          dataKeys: data.data ? Object.keys(data.data) : [],
          fullResponse: data
        });
        
        if (res.ok && data) {
          // Backend có thể trả về token ở data.token hoặc data.data.token
          const token = data.token || data.data?.token || data.accessToken;
          
          if (!token) {
            console.error('[NextAuth Credentials] ❌ No token in response!', data);
            return null;
          }
          
          console.log('[NextAuth Credentials] ✅ Got token, length:', token.length);
          
          // Backend có thể trả về structure:
          // { data: { user: { profileCompleted, role, ... }, token } } 
          // hoặc { data: { profileCompleted, role, ..., token } }
          const userData = data.data?.user || data.data || data.user || {};
          
          console.log('[NextAuth Credentials] 📊 User data structure:', {
            hasData: !!data.data,
            hasUser: !!data.data?.user,
            hasProfileCompleted: !!(userData.profileCompleted),
            userDataKeys: Object.keys(userData),
            fullData: data
          });
          
          return {
            ...userData,
            BEAccessToken: token, // Lưu access token từ backend
            profileCompleted: userData.profileCompleted ?? true, // Nếu không có thì default true (cho admin)
            role: userData.role,
          }; // Đăng nhập thành công
        }
        return null; // Đăng nhập thất bại
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "facebook") {
        try {
          // Gửi dữ liệu đến Express.js backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/auth/facebook`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "NextAuth-Secret": process.env.NEXTAUTH_SECRET as string,
            },
            body: JSON.stringify({
              provider: account.provider,
              providerId: account.providerAccountId,
              accessToken: account.access_token,
              refreshToken: account.refresh_token,
              profile: profile,
              email: user.email,
              name: user.name,
              image: user.image,
            }),
          })

          if (response.ok) {
            const data = await response.json()

            user.BEAccessToken = data.accessToken
            user.profileCompleted = data.user.profileCompleted;
            user.role = data.user.role;

            // Lưu thông tin token hoặc dữ liệu người dùng từ backend nếu cần

            return true
          } else {
            return false
          }
        } catch (error) {
          console.error("Error during Facebook login:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, account, user }) {
      console.log('[NextAuth JWT] JWT callback called:', {
        hasUser: !!user,
        hasAccount: !!account,
        provider: account?.provider,
        hasBEAccessToken: !!user?.BEAccessToken,
        userKeys: user ? Object.keys(user) : []
      });
      
      // Nếu đang đăng nhập, thêm thông tin access token vào token
      if (user) {
        // Lưu BEAccessToken vào token.accessToken
        if (user.BEAccessToken) {
          token.accessToken = user.BEAccessToken;
          console.log('[NextAuth JWT] ✅ Saved BEAccessToken to token.accessToken');
        } else {
          console.error('[NextAuth JWT] ❌ No BEAccessToken in user object!', {
            userKeys: Object.keys(user),
            user: user
          });
        }
        
        token.role = user?.role;
        token.profileCompleted = user.profileCompleted;
        
        // QUAN TRỌNG: Luôn decode JWT từ BEAccessToken để lấy userId từ backend (MongoDB _id)
        // Không dùng user.id vì đó có thể là Facebook ID hoặc provider ID
        let tokenId: string | undefined = undefined;
        
        // Ưu tiên 1: Decode từ BEAccessToken (luôn đúng vì là token từ backend)
        if (user.BEAccessToken) {
          try {
            console.log('[NextAuth JWT] 🔍 Decoding BEAccessToken to get userId from backend...');
            const parts = user.BEAccessToken.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
              console.log('[NextAuth JWT] 📊 JWT payload keys:', Object.keys(payload));
              console.log('[NextAuth JWT] 📊 JWT payload sample:', {
                _id: payload._id,
                userId: payload.userId,
                id: payload.id,
                sub: payload.sub
              });
              
              // Ưu tiên _id (theo flow backend: decoded._id)
              const jwtUserId = payload._id || payload.userId || payload.id || payload.sub;
              if (jwtUserId) {
                tokenId = jwtUserId;
                console.log('[NextAuth JWT] ✅✅✅ UserId from JWT decode (_id):', jwtUserId);
              } else {
                console.warn('[NextAuth JWT] ⚠️ No userId in JWT payload. Full payload:', payload);
              }
            }
          } catch (error) {
            console.warn('[NextAuth JWT] ⚠️ Failed to decode JWT:', error);
          }
        }
        
        // Fallback: Thử từ user object (nhưng có thể là provider ID, không phải MongoDB _id)
        if (!tokenId) {
          const userIdFromUser = (user as any)?.id || (user as any)?._id || (user as any)?.userId;
          if (userIdFromUser) {
            tokenId = userIdFromUser;
            console.log('[NextAuth JWT] ⚠️ Using userId from user object (may be provider ID):', userIdFromUser);
          } else {
            console.warn('[NextAuth JWT] ⚠️ No userId found anywhere. User keys:', Object.keys(user || {}));
          }
        }
        
        if (tokenId) {
          token.id = tokenId;
        }
      }
      else if (account?.access_token) {
        // Facebook login fallback
        token.accessToken = account.access_token
        console.log('[NextAuth JWT] ✅ Using account.access_token (Facebook)');
      }
      token.provider = account?.provider as string;

      console.log('[NextAuth JWT] Final token:', {
        hasAccessToken: !!token.accessToken,
        hasId: !!token.id,
        provider: token.provider
      });

      return token
    },
    async session({ session, token }) {
      console.log('[NextAuth Session] Session callback called:', {
        hasAccessToken: !!token.accessToken,
        hasId: !!token.id,
        provider: token.provider,
        sessionUserKeys: session.user ? Object.keys(session.user) : []
      });

      // Thêm thông tin từ token vào session
      session.accessToken = token.accessToken as string
      session.provider = token.provider as string
      session.user.profileCompleted = token.profileCompleted;
      session.user.role = token.role as string
      // Thêm userId vào session
      session.user.id = (token.id as string) || session.user.id || '';

      if (!session.accessToken) {
        console.error('[NextAuth Session] ❌ No accessToken in session! Token keys:', Object.keys(token));
      } else {
        console.log('[NextAuth Session] ✅ Session has accessToken, length:', session.accessToken.length);
      }

      if (!session.user.id) {
        console.warn('[NextAuth Session] ⚠️ No userId in session. Token.id:', token.id);
      } else {
        console.log('[NextAuth Session] ✅ Session has userId:', session.user.id);
      }

      return session
    },
  },
  pages: {
    signIn: "/login", // Tùy chỉnh trang đăng nhập nếu cần
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60, // Thời gian sống của session (30 ngày)
  },
  // debug: process.env.NODE_ENV === "development", // Bật chế độ debug trong môi trường phát triển
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
