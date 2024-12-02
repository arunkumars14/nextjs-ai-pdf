
import { ConvexVectorStore } from "@langchain/community/vectorstores/convex"
import { action } from "./_generated/server"
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
import { TaskType } from "@google/generative-ai"
import { v } from "convex/values"


export const ingest = action({
    args: {
        splitText: v.any(),
        fileId: v.string()
    },
    handler: async (ctx, args) => {
        await ConvexVectorStore.fromTexts( //if your schema is correctly defined, fromTexts will automatically use that schema to store the embeddings.
            args.splitText,
            { fileId: args.fileId },
            new GoogleGenerativeAIEmbeddings({
                apiKey: "AIzaSyA6fZgefuN2pzP4aVvZpiN8c46iUD2gE-k",
                model: "text-embedding-004",
                taskType: TaskType.RETRIEVAL_DOCUMENT,
                title: "Document Title"
            }),
            { ctx }
        )
    }
})

export const search = action({
    args: {
        query: v.string(),
        fileId: v.string()
    },
    handler: async (ctx, args) => {
        const vectorStore = new ConvexVectorStore(
            new GoogleGenerativeAIEmbeddings({
                apiKey: "AIzaSyA6fZgefuN2pzP4aVvZpiN8c46iUD2gE-k",
                model: "text-embedding-004",
                taskType: TaskType.RETRIEVAL_DOCUMENT,
                title: "Document Title"
            }),
            { ctx }
        )

        const results = await vectorStore.similaritySearch(args.query, 5);
        const resultOne = results.filter(q => q.metadata?.fileId === args.fileId);

        return JSON.stringify(resultOne)
    }
})