import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl()
})

export const addFileEntryToDb = mutation({
    args: {
        fileId: v.string(),
        storgaeId: v.string(),
        fileName: v.string(),
        createdBy: v.string(),
        fileUrl: v.string()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert("pdfFiles", {
            fileId: args.fileId,
            storgaeId: args.storgaeId,
            fileName: args.fileName,
            createdBy: args.createdBy,
            fileUrl: args.fileUrl
        })

        return "Inserted"
    }
})

export const getFileUrl = mutation({
    args: {
        storgaeId: v.string()
    },
    handler: async(ctx, args) => {
        const url = await ctx.storage.getUrl(args.storgaeId)

        return url;
    }
})

export const getFileRecord = query({
    args: {
        fileId: v.string()
    },
    handler: async(ctx, args) => {
        const result = await ctx.db.query("pdfFiles")
            .filter((q) => q.eq(q.field("fileId"), args.fileId))
            .collect()

        return result[0]
    }
})

export const getUserFiles = query({
    args: {
        userEmail: v.string()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query("pdfFiles")
            .filter((q) => q.eq(q.field("createdBy"), args.userEmail))
            .collect()
        return result
    }
})