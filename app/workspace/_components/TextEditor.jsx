"use client"
import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import EditroExtensions from './EditroExtensions'
import Bold from '@tiptap/extension-bold'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Italic from '@tiptap/extension-italic'
import Heading from '@tiptap/extension-heading'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import Code from '@tiptap/extension-code'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

const TextEditor = ({fileId, fileName}) => {

    const notes = useQuery(api.notes.getNotes, {fileId})

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Start taking notes",
            }),
            Bold,
            Highlight.configure({ multicolor: true }),
            Underline,
            Strike,
            Subscript,
            Superscript,
            Italic,
            Heading.configure({
                levels: [1, 2, 3],
            }),
            Typography,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Code,
        ],
        content: '',
        editorProps: {
            attributes: {
                class: "focus:outline-none h-screen p-5"
            }
        }
    })

    useEffect(() => {
        if(notes){
            editor && editor.commands.setContent(notes)
        }
    }, [notes, editor])

    


    return (
        <div>

            <EditroExtensions editor={editor} fileName={fileName}/>

            <div className="overflow-y-scroll h-[75vh]">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

export default TextEditor