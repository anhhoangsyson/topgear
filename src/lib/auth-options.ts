import FacebookProvider from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"

/**
 * authOptions: cấu hình NextAuth cho ứng dụng
 * - Providers: Facebook (OAuth) + Credentials (email/password)
 * - Callbacks: signIn (xử lý OAuth với backend), jwt (map token), session (map session)
 *
 * Ghi chú:
 * - Khi dùng provider OAuth, backend có thể cần exchange token và trả về accessToken riêng của BE.
 * - NEXTAUTH_SECRET phải được cấu hình trong env cho production.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    // Facebook OAuth provider
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
    // Credentials provider: gửi email/password tới backend và nhận token
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Gọi backend để xác thực
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        })
        const data = await res.json();

        // Nếu backend trả token, map user object để NextAuth lưu trong session
        if (res.ok && data) {
          const token = data.token || data.data?.token || data.accessToken;
          if (!token) return null; // không có token => auth fail
          const userData = data.data?.user || data.data || data.user || {};
          return {
            ...userData,
            BEAccessToken: token,
            profileCompleted: userData.profileCompleted ?? true,
            role: userData.role,
          };
        }
        return null;
      }
    }),
  ],
  callbacks: {
    // signIn: sau khi OAuth thành công, có thể gọi backend để exchange token / tạo user
    async signIn({ user, account, profile }) {
      if (account?.provider === "facebook") {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/auth/facebook`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // NextAuth-Secret: optional header để backend xác thực request nội bộ nếu cần
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
            // Gán dữ liệu trả về từ backend vào user để tiếp tục flow jwt/session
            user.BEAccessToken = data.accessToken
            user.profileCompleted = data.user.profileCompleted;
            user.role = data.user.role;
            return true
          } else {
            return false
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error("Error during Facebook login:", error);
          }
          return false
        }
      }
      return true
    },

    // jwt callback: map/ghi token vào jwt payload
    async jwt({ token, account, user }) {
      // Nếu có user mới (lần login), copy BE token và thông tin vào jwt
      if (user) {
        if (user.BEAccessToken) {
          token.accessToken = user.BEAccessToken;
        }
        token.role = user?.role;
        token.profileCompleted = user.profileCompleted;

        // Cố gắng decode id từ BEAccessToken (nếu là JWT)
        let tokenId: string | undefined = undefined;
        if (user.BEAccessToken) {
          try {
            const parts = user.BEAccessToken.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
              const jwtUserId = payload._id || payload.userId || payload.id || payload.sub;
              if (jwtUserId) tokenId = jwtUserId;
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('[NextAuth JWT] Failed to decode JWT:', error);
            }
          }
        }

        // Nếu không decode được, lấy id trực tiếp từ user object
        if (!tokenId) {
          const userIdFromUser = user?.id || user?._id || user?.userId;
          if (userIdFromUser) tokenId = userIdFromUser;
        }
        if (tokenId) token.id = tokenId;
      } else if (account?.access_token && !token.accessToken) {
        // Trường hợp provider trả access_token (non-BE), lưu tạm
        token.accessToken = account.access_token;
      }
      if (account?.provider) token.provider = account.provider as string;
      return token
    },

    // session callback: chuyển đổi jwt token -> session object trả về client
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.provider = token.provider as string
      session.user.profileCompleted = token.profileCompleted;
      session.user.role = token.role as string
      session.user.id = (token.id as string) || session.user.id || '';
      return session
    },
  },

  // Pages tùy chỉnh (login / error)
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  // Secret & session config
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    // maxAge (phút)
    maxAge: 30 * 24 * 60,
  },
}
