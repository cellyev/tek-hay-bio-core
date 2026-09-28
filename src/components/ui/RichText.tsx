import React from 'react'
import Link from 'next/link'

function renderText(child: Record<string, unknown>, key: string | number) {
  const text = child.text as string
  if (!text) return null
  
  const format = (child.format as number) || 0
  const isBold = format & 1
  const isItalic = format & 2
  const isUnderline = format & 8
  
  const classNames = [
    isBold ? 'font-bold' : '',
    isItalic ? 'italic' : '',
    isUnderline ? 'underline' : '',
  ].filter(Boolean).join(' ')
  
  if (classNames) {
    return <span key={key} className={classNames}>{text}</span>
  }
  return <span key={key}>{text}</span>
}

function renderNode(node: Record<string, unknown>, i: number): React.ReactNode {
  if (node.type === 'text') {
    return renderText(node, i)
  }

  const children = (node.children as Record<string, unknown>[]) || []

  if (node.type === 'link') {
    const fields = node.fields as Record<string, unknown> || {}
    const url = (fields.url as string) || (node.url as string) || '#'
    
    // Check if it's an internal or external link
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
    return (
      <p key={i}>
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
    
    return (
      <Tag key={i} className={resolvedClass}>
        {children.map((c, j) => renderNode(c, j))}
      </Tag>
    )
  }

  if (node.type === 'list') {
    const ListTag = node.listType === 'number' ? 'ol' : 'ul'
    const listClass = node.listType === 'number' ? 'list-decimal' : 'list-disc'
    return (
      <ListTag key={i} className={`${listClass} pl-5 space-y-2`}>
        {children.map((c, j) => renderNode(c, j))}
      </ListTag>
    )
  }

  if (node.type === 'listitem') {
    return (
      <li key={i}>
        {children.map((c, j) => renderNode(c, j))}
      </li>
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
