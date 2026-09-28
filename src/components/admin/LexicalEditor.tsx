'use client'

import React, { useEffect, useState } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list'
import { LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, UNDO_COMMAND, REDO_COMMAND, $getSelection, $isRangeSelection, $createParagraphNode, $getNodeByKey } from 'lexical'
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Heading1, Heading2, Undo, Redo, Type } from 'lucide-react'

const theme = {
  paragraph: 'mb-4',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
  heading: {
    h1: 'text-2xl font-bold mb-4',
    h2: 'text-xl font-bold mb-3',
  },
  list: {
    ul: 'list-disc pl-5 mb-4',
    ol: 'list-decimal pl-5 mb-4',
    listitem: 'mb-1',
  },
  link: 'text-blue-600 underline',
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [isLink, setIsLink] = useState(false)

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          // Could update active states here if needed
        }
      })
    })
  }, [editor])

  const formatHeading = (level: 'h1' | 'h2') => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(level))
      }
    })
  }

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
  }

  const insertLink = () => {
    if (!isLink) {
      const url = prompt('URL:')
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
        setIsLink(true)
      }
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
      setIsLink(false)
    }
  }

  const ToolbarButton = ({ onClick, icon: Icon, title }: { onClick: () => void, icon: any, title: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  )

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-md">
      <ToolbarButton onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} icon={Undo} title="Undo" />
      <ToolbarButton onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} icon={Redo} title="Redo" />
      <div className="w-px h-5 bg-slate-300 mx-1" />
      <ToolbarButton onClick={formatParagraph} icon={Type} title="Paragraph" />
      <ToolbarButton onClick={() => formatHeading('h1')} icon={Heading1} title="Heading 1" />
      <ToolbarButton onClick={() => formatHeading('h2')} icon={Heading2} title="Heading 2" />
      <div className="w-px h-5 bg-slate-300 mx-1" />
      <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} icon={Bold} title="Bold" />
      <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} icon={Italic} title="Italic" />
      <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')} icon={Underline} title="Underline" />
      <div className="w-px h-5 bg-slate-300 mx-1" />
      <ToolbarButton onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} icon={List} title="Bullet List" />
      <ToolbarButton onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} icon={ListOrdered} title="Numbered List" />
      <div className="w-px h-5 bg-slate-300 mx-1" />
      <ToolbarButton onClick={insertLink} icon={LinkIcon} title="Link" />
    </div>
  )
}

function InitialStatePlugin({ initialJson }: { initialJson: any }) {
  const [editor] = useLexicalComposerContext()
  const [initialized, setInitialized] = useState(false)
  
  useEffect(() => {
    if (!initialized && initialJson && Object.keys(initialJson).length > 0) {
      try {
        const editorState = editor.parseEditorState(initialJson)
        editor.setEditorState(editorState)
      } catch (e) {
        console.error('Error parsing initial Lexical state', e)
      }
      setInitialized(true)
    }
  }, [editor, initialJson, initialized])
  return null
}

export function LexicalEditor({ 
  initialData, 
  onChange 
}: { 
  initialData?: any, 
  onChange: (json: any) => void 
}) {
  const initialConfig = {
    namespace: 'CustomAdminEditor',
    theme,
    onError: (error: Error) => console.error(error),
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode
    ],
  }

  const handleChange = (editorState: any) => {
    editorState.read(() => {
      const json = editorState.toJSON()
      onChange(json)
    })
  }

  return (
    <div className="border border-slate-200 rounded-md bg-white overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent transition-all">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative p-4 min-h-[300px]">
          <RichTextPlugin
            contentEditable={<ContentEditable className="outline-none min-h-[300px]" />}
            placeholder={<div className="absolute top-4 left-4 text-slate-400 pointer-events-none">Mulai mengetik...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <OnChangePlugin onChange={handleChange} />
          {initialData && <InitialStatePlugin initialJson={initialData} />}
        </div>
      </LexicalComposer>
    </div>
  )
}
