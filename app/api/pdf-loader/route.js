import { NextResponse } from "next/server";

import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

//const pdfUrl = "https://dazzling-curlew-318.convex.cloud/api/storage/3f0699cc-5a94-456d-913e-cd57b8e1665e"

export async function GET (req){

    const reqUrl = req.url;
    const {searchParams} = new URL(reqUrl)
    const pdfUrl = searchParams.get("pdfUrl")

    //1. Load pdf file
    const response = await fetch(pdfUrl)

    const data = await response.blob()
    const loader = new WebPDFLoader(data)
    const docs = await loader.load()

    let pdfTextContent = ""
    docs.forEach((doc) => {
        pdfTextContent = pdfTextContent + doc.pageContent
    })

    //2.Split the text into small chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20
    })

    const output = await splitter.createDocuments([pdfTextContent])

    let splitterList = []
    output.forEach((doc) => {
        splitterList.push(doc.pageContent)
    })

    return NextResponse.json({result: splitterList})
}