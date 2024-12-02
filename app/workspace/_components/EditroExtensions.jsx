"use client"
import { chatSession } from '@/config/AIModel'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { useAction, useMutation } from 'convex/react'
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, Code, Heading1Icon, Heading2Icon, Heading3Icon, HighlighterIcon, Italic, Save, SaveAllIcon, Sparkles, StrikethroughIcon, Subscript, Superscript, UnderlineIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const EditroExtensions = ({ editor, fileName }) => {

    const { fileId } = useParams()
    const searchAi = useAction(api.myAction.search)
    const saveNotes = useMutation(api.notes.addNotes)
    const { user } = useUser()

    const onAiClick = async () => {
        toast("AI is searching the answer in pdf")
        const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            " "
        );

        const result = await searchAi({
            query: selectedText,
            fileId
        })

        const unformattedAns = JSON.parse(result)
        let allUnformattedAnswer = ""

        unformattedAns && unformattedAns.forEach(item => {
            allUnformattedAnswer = allUnformattedAnswer + item.pageContent
        })

        const prompt = "For question: " + selectedText + "and with given content as answer," + "please give appropriate answer in HTML format. The answer content is: " + allUnformattedAnswer + "Also don't add the question once again when answering, give answer only"

        const aiModelResult = await chatSession.sendMessage(prompt)

        const finalAns = aiModelResult.response.text().replace("```html", "").replace("```", "")

        const AllText = editor.getHTML()
        editor.commands.setContent(AllText + '<p><strong>Answer: </strong>' + finalAns + '</p>')

        saveNotes({
            notes: editor.getHTML(),
            fileId,
            createdBy: user?.primaryEmailAddress?.emailAddress
        })

    }

    const saveByButtonClick = () => {
        saveNotes({
            notes: editor.getHTML(),
            fileId,
            createdBy: user?.primaryEmailAddress?.emailAddress
        })
        toast(`${fileName} file is saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`)

    }
    return editor && (
        <div className="p-5 border-b">
            <div className="control-group">
                <div className="button-group flex gap-3 flex-wrap">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'text-red-600' : ''}
                    >
                        <BoldIcon />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'text-red-600' : ''}
                    >
                        <Italic />
                    </button>

                    <button
                        onClick={() => editor?.chain()?.focus()?.toggleHighlight()?.run()}
                        className={editor.isActive('highlight') ? 'text-red-600' : ''}
                    >
                        <HighlighterIcon />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={editor.isActive('underline') ? 'text-red-600' : ''}
                    >
                        <UnderlineIcon />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={editor.isActive('strike') ? 'text-red-600' : ''}
                    >
                        <StrikethroughIcon />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleSubscript().run()}
                        className={editor.isActive('subscript') ? 'text-red-600' : ''}
                    >
                        <Subscript />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleSuperscript().run()}
                        className={editor.isActive('superscript') ? 'text-red-600' : ''}
                    >
                        <Superscript />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={editor.isActive('heading', { level: 1 }) ? 'text-red-600' : ''}
                    >
                        <Heading1Icon />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={editor.isActive('heading', { level: 2 }) ? 'text-red-600' : ''}
                    >
                        <Heading2Icon />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={editor.isActive('heading', { level: 3 }) ? 'text-red-600' : ''}
                    >
                        <Heading3Icon />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={editor.isActive({ textAlign: 'left' }) ? 'text-red-600' : ''}
                    >
                        <AlignLeftIcon />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={editor.isActive({ textAlign: 'center' }) ? 'text-red-600' : ''}
                    >
                        <AlignCenterIcon />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={editor.isActive({ textAlign: 'right' }) ? 'text-red-600' : ''}
                    >
                        <AlignRightIcon />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        className={editor.isActive({ textAlign: 'justify' }) ? 'text-red-600' : ''}
                    >
                        <AlignJustifyIcon />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        className={editor.isActive('code') ? 'text-red-600' : ''}
                    >
                        <Code />
                    </button>

                    <button
                        onClick={() => onAiClick()}
                        className="hover:text-blue-500 transition-all duration-300"
                    >
                        <Sparkles />
                    </button>

                    <button onClick={saveByButtonClick}>
                        <Save />
                    </button>
                </div>
            </div>

        </div>
    )
}

export default EditroExtensions