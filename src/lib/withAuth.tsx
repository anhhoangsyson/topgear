import { verifyToken } from "@/lib/auth";
import { JSX } from "react/jsx-runtime";

type ServerComponent<T> = (props: T) => Promise<JSX.Element>;

export async function withAuth<P extends object>(Component: ServerComponent<P>) {
    return async function AuthComponent(props: P) {
        const isAuthenticated = await verifyToken()

        if (!isAuthenticated) {
            if (typeof window !== "undefined") {
                window.location.href = "/login"
            }
        }

        return <Component {...props} />;
    }
}
