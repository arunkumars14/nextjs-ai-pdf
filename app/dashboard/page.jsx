"use client"
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import Image from 'next/image'
import React from 'react'
import Loader from '../workspace/_components/Loader'
import { useRouter } from 'next/navigation'

const Dashboard = () => {
  const {user} = useUser()
  const router = useRouter()
  const fileList = useQuery(api.fileStorage.getUserFiles, {userEmail: user?.primaryEmailAddress?.emailAddress})



  if(!fileList) return (<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-10 gap-5">
    {[1,2,3,4,5,6].map((item, index) => (
      <div className="bg-slate-200 rounded-md h-[150px] animate-pulse" key={index}></div>
    ))}
    </div>)

  return (
    <div>
      <h2 className="font-bold text-3xl">Workspace</h2>

      <div className={`${fileList.length === 0 ? "w-full" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-10 gap-5"}`}>

        {fileList.length > 0 ? fileList?.map((file, index) => (
          <div onClick={()=> router.push(`/workspace/${file?.fileId}`)} className="flex p-5 hover:shadow-md rounded-md flex-col items-center justify-center border shadow-sm cursor-pointer hover:scale-105 transition-all duration-300" key={file?._id}>
            <Image src={'/pdf.png'} alt='logo' width={50} height={50} />

            <h2 className="mt-3 font-medium text-lg">{file?.fileName}</h2>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center h-[60vh] w-full">
            <h1 className="font-bold lg:text-6xl md:text-4xl sm:text-2xl">
            You didn't uplaod any files
            </h1>
            <h3 className="lg:text-3xl md:text-2xl mt-3 sm:text-xl">Start uplaodig files to get answer from AI</h3>
          </div>
        )}
      </div>

    </div>
  )
}

export default Dashboard