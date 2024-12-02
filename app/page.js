"use client"

import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from "@/components/ui/ui/TextGenerate";
import { api } from "@/convex/_generated/api";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const { user } = useUser()

  const createUser = useMutation(api.user.createUser)

  const checkUser = async () => {
    const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress,
      imageUrl: user?.imageUrl,
      userName: user?.fullName
    })

  }
  const router = useRouter()

  const { signOut } = useClerk()

  useEffect(() => {
    if (user) {
      checkUser()
    }
  }, [user])

  return (
    <div className="bg-[url('/bg-pdf.png')] bg-cover bg-center h-screen w-full items-center justify-center flex p-3">

      <div className="flex flex-col justify-center items-center gap-6 shadow-2xl bg-red-200/20 backdrop-blur-lg rounded-3xl p-20">
        <Image src={'/logo.svg'} alt='logo' width={170} height={120} />

        <div className="flex flex-col flex-wrap gap-3 justify-center items-center">

        <div className="">
          <TextGenerateEffect words="Get answers from PDF using AI"/>
        </div>

        <p className="md:text-sm sm:text-xs text-center font-normal text-[12px]">Elevate your note-taking experience with our AI-powered app.</p>
        <p className="md:text-sm sm:text-xs text-center font-normal text-[12px]">Seamless extract key insights, summaries and annotations from any PDF with just a few clicks</p>
        </div>

        <div className="flex flex-row flex-wrap gap-5">
          <SignedOut>
            <Button className="bg-red-500 hover:bg-white hover:text-red-500 transition-all duration-300 hover:shadow-xl text-white" onClick={() => router.push(`/sign-in`)}>
              Login
            </Button>
          </SignedOut>



          <Button className="bg-red-500 hover:bg-white hover:text-red-500 transition-all duration-300 hover:shadow-xl text-white" onClick={() => router.push(`/dashboard`)}>
            Dashboard
          </Button>

          <Button className="bg-red-500 hover:bg-white hover:text-red-500 transition-all duration-300 hover:shadow-xl text-white" onClick={() => router.push(`/dashboard/upgrade`)}>
            Plan Details
          </Button>

          <SignedIn>
            <Button className="bg-red-500 hover:bg-white hover:text-red-500 transition-all duration-300 hover:shadow-xl text-white" onClick={() => {
              signOut()
              router.push("/")
            }}>
              Logout
            </Button >
          </SignedIn>

        </div>
      </div>


    </div>

  );
}
