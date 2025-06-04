// components/AuthButtons.tsx
import { Button } from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { FaFacebook } from "react-icons/fa";

export default function AuthButtons() {

  // const handleFetchData = async () => {
  //   const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/protected-route`, {
  //     headers: {
  //       Authorization: `Bearer ${session?.accessToken}`
  //     }
  //   });
  //   // Handle response
  //   if (res.ok) {
  //     const data = await res.json();
  //     console.log("Protected data:", data);
  //     // Do something with the data

  //   } else {
  //     console.error("Failed to fetch protected data");
  //   }
  // };

  // if (session) {
  //   return (
  //     <div>
  //       <button onClick={handleFetchData}>Get Protected Data</button>

  //     </div>
  //   );
  // }

  return (
    <div
      onClick={() => signIn('facebook', { callbackUrl: '/' })}
      className="flex items-center justify-center w-full gap-y-4 ">
      <Button
        variant={"outline"}
        className="flex w-full items-center justify-center gap-3 py-6 px-20 text-base font-normal text-gray-700 transition-colors rounded-lg hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
      >
        <FaFacebook
          className="text-xl text-blue-600 w-8 h-8"
        />
        Login with Facebook
      </Button>
    </div>
  )
}