import { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import axios from "axios";

export const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      profile(profile:any) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "facebook") {
        try {
          await axios.post(`${process.env.EXPRESS_API_URL}/auth/sync-facebook-user`, {
            email: user.email,
            fullname: user.name,
            avatar: user.image,
            authType: "facebook",
            usersname: user.email?.split("@")[0] || `user-${user.id}`,
            password: "no-password-for-social-auth",
          });
          return true;
        } catch (error) {
          console.error("Sync failed:", error);
          return false;
        }
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};