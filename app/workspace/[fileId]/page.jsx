"use client"
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import WorkspaceHeader from '../_components/WorkspaceHeader'
import PdfViewer from '../_components/PdfViewer'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import TextEditor from '../_components/TextEditor'
import Loader from '../_components/Loader'


const Workspace = () => {
    const { fileId } = useParams()
    const fileInfo = useQuery(api.fileStorage.getFileRecord, {fileId})

    if(!fileInfo) return <Loader />

    return (
        <div>
            <WorkspaceHeader  fileName= {fileInfo.fileName} fileId={fileInfo?.fileId}/>

            <div className="grid grid-cols-2 gap-5">
                <div className="">
                    <TextEditor fileId={fileId} fileName= {fileInfo.fileName}/>
                </div>

                <div className="">
                    <PdfViewer fileUrl={fileInfo?.fileUrl}/>
                </div>
            </div>
        </div>
    )
}

export default Workspace