import NextAuth from "next-auth/next"
import FacebookProvider from "next-auth/providers/facebook"
import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Email from "next-auth/providers/email"

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
        const user = await res.json();
        if (res.ok && user) {
          return user; // Đăng nhập thành công
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
            // console.log('token from be', data.accessToken);
            user.BEAccessToken = data.accessToken
            // console.log('token luu trong user',user.BEAccessToken);

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
      // Nếu đang đăng nhập, thêm thông tin access token vào token
      if (user?.BEAccessToken) {
        token.accessToken = user.BEAccessToken
        // console.log('token from jwt', token.accessToken);

      }
      else if (account?.access_token) {
        token.accessToken = account.access_token
      }
      token.provider = account?.provider as string;

      return token
    },
    async session({ session, token }) {
      // console.log('sesstion callback:', session, token);

      // Thêm thông tin từ token vào session
      session.accessToken = token.accessToken as string
      session.provider = token.provider as string
      return session
    },
  },
  pages: {
    signIn: "/login", // Tùy chỉnh trang đăng nhập nếu cần
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Thời gian sống của session (30 ngày)
  },
  // debug: process.env.NODE_ENV === "development", // Bật chế độ debug trong môi trường phát triển
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
