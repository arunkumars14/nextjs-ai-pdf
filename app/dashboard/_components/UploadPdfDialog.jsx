"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { useAction, useMutation } from 'convex/react'
import { Loader2Icon } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import uuid4 from 'uuid4'

const UploadPdfDialog = ({ children, isMax }) => {

    const genreateUploadUrl = useMutation(api.fileStorage.generateUploadUrl)

    const addFileEntry = useMutation(api.fileStorage.addFileEntryToDb)

    const embeddDocument = useAction(api.myAction.ingest)

    const getFileUrl = useMutation(api.fileStorage.getFileUrl)

    const { user } = useUser()

    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState(null)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    function isButtonValid() {
        return Boolean(file)
    }

    const onFileSelect = (event) => {
        setFile(event.target.files[0])
    }

    const onUpload = async () => {
        setLoading(true)
        const postUrl = await genreateUploadUrl()
        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file?.type },
            body: file
        })

        const { storageId: storgaeId } = await result.json()
        const fileId = uuid4()

        const fileUrl = await getFileUrl({
            storgaeId
        })

        const resp = await addFileEntry({
            fileId,
            storgaeId,
            fileName: fileName || `Untitle-${uuid4()}`,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            fileUrl
        })

        const apiResponse = await axios.get("/api/pdf-loader?pdfUrl=" + fileUrl)
        console.log(apiResponse.data.result)
        await embeddDocument({
            splitText: apiResponse.data.result,
            fileId
        })

        setFile(null)
        setFileName("")
        setLoading(false)
        setOpen(false)

        toast("File uploaded successfully")
    }


    return (
        <Dialog onOpenChange={()=>{
            setFile(null)
            setFileName("")
            setOpen(!open)
        }} open={open}>
            <DialogTrigger asChild>
                <Button disabled={isMax} className="w-full" onClick={() =>setOpen(true)}>Upload pdf</Button>
            </DialogTrigger>
            <DialogContent className="rounded-md max-sm:w-[350px]">
                <DialogHeader>
                    <DialogTitle>
                        Upload your file
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Descrption
                    </DialogDescription>
                </DialogHeader>

                <div className="">
                    <div className="flex flex-col mt-5 gap-1">
                        <h2 className="">Select a file to upload:</h2>

                        <div className="border p-1.5 rounded-md">
                            <input type="file" className="max-sm:w-[300px]" accept='application/pdf' onChange={(event) => onFileSelect(event)} />
                        </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-1">
                        <label htmlFor="" className="">File name:</label>

                        <Input className="max-sm:w-[310px]" placeholder="File Name" type="text" onChange={(e) => setFileName(e.target.value)} />
                    </div>
                </div>

                <DialogFooter className="sm:justify-end gap-2">
                    <DialogClose asChild>
                        <Button className="max-sm:w-[310px]" type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>

                    <Button className="max-sm:w-[310px]" onClick={onUpload} disabled={!isButtonValid() || loading}>{loading ? <Loader2Icon className='animate-spin' /> : "Upload"} </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UploadPdfDialog