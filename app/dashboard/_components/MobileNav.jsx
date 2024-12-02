"use client"
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Layout, Shield } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import UploadPdfDialog from './UploadPdfDialog'
import { SignedIn, useClerk, UserButton, useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { usePathname, useRouter } from 'next/navigation'

const MobileNav = () => {
    const [sheetOpen, setSheetOpen] = useState(false)
    const path = usePathname()
    const { user } = useUser()
    const router = useRouter()
    const { signOut } = useClerk()

    const getUserInfo = useQuery(api.user.getUserInfo, {
        userEmail: user?.primaryEmailAddress?.emailAddress
    })

    const fileList = useQuery(api.fileStorage.getUserFiles, { userEmail: user?.primaryEmailAddress?.emailAddress })

    if (!user && !getUserInfo) return 
    return (
        <div className="">
            <div className="p-5 cursor-pointer" onClick={() => setSheetOpen(true)}>
                <Menu />
            </div>
            <Sheet open={sheetOpen} onOpenChange={() => setSheetOpen(!sheetOpen)}>
                <SheetContent side="left">
                    <SheetHeader >
                        <SheetTitle className="sr-only">Mobile</SheetTitle>
                        <SheetDescription className="sr-only">
                            Mobile
                        </SheetDescription>
                    </SheetHeader>
                    <div className='h-screen p-3'>
                        <Image src={'/logo.svg'} alt='logo' width={170} height={120} />

                        <div className="mt-10">

                            {getUserInfo && <UploadPdfDialog isMax={(fileList?.length >= 5 && !getUserInfo?.upgrade) ? true : false}>
                                <Button className="w-full">Upload pdf</Button>
                            </UploadPdfDialog>}

                            <div className={`flex gap-2 items-center p-3 mt-5 hover:bg-slate-100 rounded-lg cursor-pointer ${path == '/dashboard' ? "bg-slate-200" : ""}`} onClick={() =>{
                                 router.push(`/dashboard`)
                                 setSheetOpen(false)
                            }}>
                                <Layout />
                                <h2 className="">Workspace</h2>
                            </div>

                            <div className={`flex gap-2 items-center p-3 mt-1 hover:bg-slate-100 rounded-lg cursor-pointer ${path == '/dashboard/upgrade' ? "bg-slate-200" : ""}`} onClick={() => {
                                router.push(`/dashboard/upgrade`)
                                setSheetOpen(false)
                            }}>
                                <Shield />
                                <h2 className="">Upgrade</h2>
                            </div>

                            <div className="flex gap-2 items-center p-3 mt-1">
                                <SignedIn>
                                    <UserButton />
                                    <h2 className="">{user?.firstName} {user?.lastName}</h2>
                                </SignedIn>
                            </div>

                            <div className="flex gap-2 items-center p-3 mt-1">
                                <SignedIn>
                                    <Button onClick={() => {
                                        signOut()
                                        router.push("/")
                                    }}>
                                        SignOut
                                    </Button>
                                </SignedIn>
                            </div>
                        </div>


                        {!getUserInfo?.upgrade && <div className="absolute bottom-24 w-[80%]">
                            <Progress value={(fileList?.length / 5) * 100} />
                            <p className="text-sm mt-1">{`${fileList?.length} out of 5 pdf uploaded`}</p>
                            <p className="text-sm text-gray-400 mt-2">Upgrade t0 upload more files</p>
                        </div>}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MobileNav