// components/AuthButtons.tsx
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session } = useSession();
  console.log("Session token:", session?.accessToken);
  
  const handleFetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/protected-route`, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`
      }
    });
    // Handle response
    if (res.ok) {
      const data = await res.json();
      console.log("Protected data:", data);
      // Do something with the data

    } else {
      console.error("Failed to fetch protected data");
    }
  };

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user?.name}!</p>
        <button onClick={() => signOut()}>Logout</button>
        <button onClick={handleFetchData}>Get Protected Data</button>
      </div>
    );
  }

  return <button onClick={() => signIn('facebook', { callbackUrl: '/' })}>Login with Facebook</button>;
}