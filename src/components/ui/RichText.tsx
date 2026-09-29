import React from 'react'
import Link from 'next/link'
import { MediaImage } from './MediaImage'

function getTextAlign(format: string | number | undefined): string {
  if (format === 'center') return 'text-center'
  if (format === 'right') return 'text-right'
  if (format === 'justify') return 'text-justify'
  if (format === 'left') return 'text-left'
  return ''
}

function renderText(child: Record<string, unknown>, key: string | number) {
  const text = child.text as string
  if (text === undefined || text === null) return null
  
  const format = (child.format as number) || 0
  const isBold = format & 1
  const isItalic = format & 2
  const isStrikethrough = format & 4
  const isUnderline = format & 8
  const isCode = format & 16
  const isSubscript = format & 32
  const isSuperscript = format & 64
  
  const classNames = [
    isBold ? 'font-bold' : '',
    isItalic ? 'italic' : '',
    isUnderline ? 'underline' : '',
    isStrikethrough ? 'line-through' : '',
  ].filter(Boolean).join(' ')
  
  let result: React.ReactNode = text
  
  if (isCode) {
    result = <code className="bg-stone-100 text-stone-800 px-1 py-0.5 rounded font-mono text-sm">{result}</code>
  }
  
  if (isSubscript) {
    result = <sub>{result}</sub>
  } else if (isSuperscript) {
    result = <sup>{result}</sup>
  }
  
  if (classNames) {
    result = <span className={classNames}>{result}</span>
  }
  
  return <React.Fragment key={key}>{result}</React.Fragment>
}

function renderNode(node: Record<string, unknown>, i: number): React.ReactNode {
  if (node.type === 'text') {
    return renderText(node, i)
  }

  const children = (node.children as Record<string, unknown>[]) || []

  if (node.type === 'link') {
    const fields = node.fields as Record<string, unknown> || {}
    const url = (fields.url as string) || (node.url as string) || '#'
    const isInternal = url.startsWith('/')
    
    if (isInternal) {
      return (
        <Link key={i} href={url} className="text-primary hover:underline font-medium">
          {children.map((c, j) => renderNode(c, j))}
        </Link>
      )
    }
    
    return (
      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
        {children.map((c, j) => renderNode(c, j))}
      </a>
    )
  }

  if (node.type === 'paragraph') {
    const alignClass = getTextAlign(node.format as string)
    // Check if any child is a block element like 'upload'
    const hasBlockChild = children.some(c => c.type === 'upload' || c.type === 'horizontalrule' || c.type === 'quote' || c.type === 'code')
    
    if (hasBlockChild) {
      return (
        <div key={i} className={`mb-4 ${alignClass || ''}`.trim()}>
          {children.map((c, j) => renderNode(c, j))}
        </div>
      )
    }

    return (
      <p key={i} className={alignClass || undefined}>
        {children.map((c, j) => renderNode(c, j))}
      </p>
    )
  }

  if (node.type === 'heading') {
    const level = ((node.tag as string)?.replace('h', '') || '2') as '1' | '2' | '3' | '4' | '5' | '6'
    const Tag = `h${level}` as keyof JSX.IntrinsicElements
    const sizeClasses: Record<string, string> = {
      '1': 'text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6 mt-8',
      '2': 'text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4 mt-8',
      '3': 'text-2xl font-serif font-bold text-stone-900 mb-4 mt-6',
      '4': 'text-xl font-bold text-stone-900 mb-2 mt-4',
      '5': 'text-lg font-bold text-stone-900 mb-2 mt-4',
      '6': 'text-base font-bold text-stone-900 mb-2 mt-4',
    }
    const resolvedClass = sizeClasses[level] || 'text-2xl font-serif font-bold text-stone-900 mb-4 mt-6'
    const alignClass = getTextAlign(node.format as string)
    
    return (
      <Tag key={i} className={`${resolvedClass} ${alignClass}`.trim()}>
        {children.map((c, j) => renderNode(c, j))}
      </Tag>
    )
  }

  if (node.type === 'list') {
    const ListTag = node.listType === 'number' ? 'ol' : 'ul'
    const isChecklist = node.listType === 'check'
    const listClass = node.listType === 'number' ? 'list-decimal' : (isChecklist ? 'list-none' : 'list-disc')
    return (
      <ListTag key={i} className={`${listClass} ${isChecklist ? 'pl-0' : 'pl-5'} space-y-2`}>
        {children.map((c, j) => renderNode(c, j))}
      </ListTag>
    )
  }

  if (node.type === 'listitem') {
    const isChecked = node.checked as boolean | undefined
    if (isChecked !== undefined) {
      return (
        <li key={i} className="flex items-start gap-2">
          <input type="checkbox" checked={isChecked} readOnly className="mt-1" />
          <div className={`flex-1 ${isChecked ? 'line-through text-stone-400' : ''}`}>
            {children.map((c, j) => renderNode(c, j))}
          </div>
        </li>
      )
    }
    return (
      <li key={i}>
        {children.map((c, j) => renderNode(c, j))}
      </li>
    )
  }

  if (node.type === 'quote') {
    return (
      <blockquote key={i} className="border-l-4 border-primary pl-4 py-1 italic text-stone-600 bg-stone-50 my-4">
        {children.map((c, j) => renderNode(c, j))}
      </blockquote>
    )
  }

  if (node.type === 'horizontalrule') {
    return <hr key={i} className="my-8 border-stone-200" />
  }

  if (node.type === 'code') {
    return (
      <pre key={i} className="bg-stone-900 text-stone-100 p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono">
        {children.map((c, j) => renderNode(c, j))}
      </pre>
    )
  }

  if (node.type === 'block' && (node.fields as any)?.blockType === 'Code') {
    const code = (node.fields as any)?.code || ''
    return (
      <pre key={i} className="bg-stone-900 text-stone-100 p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono">
        <code>{code}</code>
      </pre>
    )
  }

  if (node.type === 'upload' && node.value) {
    const media = node.value as any
    const fields = node.fields as any || {}
    const align = fields.alignment || 'center'
    
    let alignClass = ''
    if (align === 'left') alignClass = 'mr-auto'
    else if (align === 'right') alignClass = 'ml-auto'
    else if (align === 'center') alignClass = 'mx-auto'
    else if (align === 'full') alignClass = 'w-full'
    
    return (
      <figure key={i} className={`my-6 ${alignClass} ${align !== 'full' ? 'max-w-3xl' : ''}`}>
        <MediaImage
          media={media}
          className="rounded-lg shadow-sm"
          width={media.width}
          height={media.height}
        />
        {fields.caption && (
          <figcaption className="text-center text-sm text-stone-500 mt-2 italic">
            {fields.caption}
          </figcaption>
        )}
      </figure>
    )
  }

  // Fallback for unsupported nodes
  if (children.length > 0) {
    return <React.Fragment key={i}>{children.map((c, j) => renderNode(c, j))}</React.Fragment>
  }
  return null
}

export function RichText({ content, className = '' }: { content: unknown, className?: string }) {
  if (!content) return null

  // If it's just a string, render it (handle safely)
  if (typeof content === 'string') {
    return <div className={`space-y-4 text-stone-700 leading-relaxed ${className}`} dangerouslySetInnerHTML={{ __html: content }} />
  }

  const typedContent = content as { root?: { children?: Record<string, unknown>[] } }

  // Lexical JSON to HTML renderer
  if (typedContent?.root?.children) {
    return (
      <div className={`space-y-4 text-stone-700 leading-relaxed ${className}`}>
        {typedContent.root.children.map((node, i) => renderNode(node, i))}
      </div>
    )
  }

  return <div className={`text-stone-500 italic ${className}`}>Kandungan tidak dapat ditampilkan.</div>
}
