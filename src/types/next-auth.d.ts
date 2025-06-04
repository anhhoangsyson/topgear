import  { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Profile extends DefaultProfile {
        id?: string; // Thêm trường 'id' vào Profile
    }

    interface Session extends DefaultSession {
        accessToken?: string;
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            profileCompleted?: boolean;
            role: string;
        } & DefaultSession["user"];
        provider?: string;
    }

    interface User extends DefaultUser {
        id: string;
        BEAccessToken?: string;
        provider?: string;
        profileCompleted?: boolean;
        role?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        id?: string;
        provider?: string;
        profileCompleted?: boolean;
        role?: string;
    }
}