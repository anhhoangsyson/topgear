import FacebookProvider from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"

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
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        })
        const data = await res.json();
        if (res.ok && data) {
          const token = data.token || data.data?.token || data.accessToken;
          if (!token) return null;
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "facebook") {
        try {
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
    async jwt({ token, account, user }) {
      if (user) {
        if (user.BEAccessToken) {
          token.accessToken = user.BEAccessToken;
        }
        token.role = user?.role;
        token.profileCompleted = user.profileCompleted;
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
        if (!tokenId) {
          const userIdFromUser = user?.id || user?._id || user?.userId;
          if (userIdFromUser) tokenId = userIdFromUser;
        }
        if (tokenId) token.id = tokenId;
      } else if (account?.access_token && !token.accessToken) {
        token.accessToken = account.access_token;
      }
      if (account?.provider) token.provider = account.provider as string;
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.provider = token.provider as string
      session.user.profileCompleted = token.profileCompleted;
      session.user.role = token.role as string
      session.user.id = (token.id as string) || session.user.id || '';
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60,
  },
}
