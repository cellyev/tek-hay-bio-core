'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
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
import { HorizontalRuleNode, INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode'
import { CodeNode } from '@lexical/code'
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, UNDO_COMMAND, REDO_COMMAND, $getSelection, $isRangeSelection, $createParagraphNode, $getNodeByKey, DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode, createCommand, LexicalCommand, COMMAND_PRIORITY_EDITOR, $insertNodes, ElementNode } from 'lexical'
import { $createHeadingNode, $isHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $createCodeNode } from '@lexical/code'
import { $setBlocksType } from '@lexical/selection'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin'
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Undo, Redo, Type, Image as ImageIcon, Code, AlignLeft, AlignCenter, AlignRight, AlignJustify, Strikethrough, Subscript, Superscript, Quote, Minus, X, UploadCloud, ChevronDown, Check, Loader2 } from 'lucide-react'

// Custom Upload Node for Payload Media
export interface SerializedUploadNode extends SerializedLexicalNode {
  relationTo: string;
  value: any;
  fields: {
    caption?: string;
    alignment?: string;
  };
}

export class UploadNode extends DecoratorNode<React.ReactNode> {
  __id: string;
  __url: string;
  __alt: string;
  __caption: string;
  __alignment: string;
  __relationTo: string;

  static getType(): string {
    return 'upload';
  }

  static clone(node: UploadNode): UploadNode {
    return new UploadNode(node.__id, node.__url, node.__alt, node.__caption, node.__alignment, node.__relationTo, node.__key);
  }

  constructor(id: string, url: string, alt: string = '', caption: string = '', alignment: string = 'center', relationTo: string = 'media', key?: NodeKey) {
    super(key);
    this.__id = id;
    this.__url = url;
    this.__alt = alt;
    this.__caption = caption;
    this.__alignment = alignment;
    this.__relationTo = relationTo;
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span');
    return span;
  }

  updateDOM(): false {
    return false;
  }

  exportJSON(): SerializedUploadNode {
    return {
      type: 'upload',
      relationTo: this.__relationTo,
      value: this.__id,
      fields: {
        caption: this.__caption,
        alignment: this.__alignment,
      },
      version: 1,
    };
  }

  static importJSON(_serializedNode: SerializedLexicalNode): UploadNode {
    const serializedNode = _serializedNode as SerializedUploadNode;
    const value = serializedNode.value;
    const id = typeof value === 'object' && value !== null ? value.id : value;
    const url = typeof value === 'object' && value !== null ? value.url : '';
    const alt = typeof value === 'object' && value !== null ? value.alt : '';
    const node = $createUploadNode(id, url, alt, serializedNode.fields?.caption, serializedNode.fields?.alignment);
    return node;
  }

  decorate(): React.ReactNode {
    let alignClass = 'items-center text-center';
    if (this.__alignment === 'left') alignClass = 'items-start text-left mr-auto';
    else if (this.__alignment === 'right') alignClass = 'items-end text-right ml-auto';
    else if (this.__alignment === 'full') alignClass = 'w-full block';

    return (
      <div className={`my-4 flex flex-col ${alignClass} relative group border-2 border-transparent hover:border-slate-300 rounded p-1`} contentEditable={false}>
        {this.__url ? (
          <img src={this.__url} alt={this.__alt} className={`rounded shadow-sm ${this.__alignment === 'full' ? 'w-full' : 'max-w-full'}`} style={{ maxHeight: this.__alignment === 'full' ? 'none' : '400px' }} />
        ) : (
          <div className="w-full h-32 bg-slate-100 flex items-center justify-center text-slate-500 rounded border border-slate-200">
            Media ID: {this.__id}
          </div>
        )}
        {this.__caption && <div className="text-sm text-slate-500 mt-2 italic">{this.__caption}</div>}
      </div>
    );
  }
}

export function $createUploadNode(id: string, url: string, alt: string, caption?: string, alignment?: string, relationTo: string = 'media'): UploadNode {
  return new UploadNode(id, url, alt, caption, alignment, relationTo);
}

export function $isUploadNode(node: LexicalNode | null | undefined): node is UploadNode {
  return node instanceof UploadNode;
}

export const INSERT_UPLOAD_COMMAND: LexicalCommand<{ id: string, url: string, alt: string, caption?: string, alignment?: string, relationTo?: string }> = createCommand();

function UploadPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      INSERT_UPLOAD_COMMAND,
      (payload) => {
        const uploadNode = $createUploadNode(payload.id, payload.url, payload.alt, payload.caption, payload.alignment, payload.relationTo);
        $insertNodes([uploadNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);
  return null;
}

const theme = {
  paragraph: 'mb-4 leading-relaxed',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    subscript: 'align-sub text-[0.8em]',
    superscript: 'align-super text-[0.8em]',
    code: 'bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-sm',
  },
  heading: {
    h1: 'text-4xl font-serif font-bold mb-6 mt-8',
    h2: 'text-3xl font-serif font-bold mb-4 mt-8',
    h3: 'text-2xl font-serif font-bold mb-4 mt-6',
    h4: 'text-xl font-bold mb-2 mt-4',
    h5: 'text-lg font-bold mb-2 mt-4',
    h6: 'text-base font-bold mb-2 mt-4',
  },
  list: {
    ul: 'list-disc pl-5 mb-4 space-y-2',
    ol: 'list-decimal pl-5 mb-4 space-y-2',
    listitem: '',
  },
  quote: 'border-l-4 border-slate-800 pl-4 py-1 italic text-slate-600 bg-slate-50 my-4',
  code: 'bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono block',
  link: 'text-blue-600 underline',
}

function MediaLibraryModal({ onClose, onSelect, mediaCollection = 'media' }: { onClose: () => void, onSelect: (media: any, caption: string, alignment: string) => void, mediaCollection?: string }) {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);
  const [usageStatus, setUsageStatus] = useState<any>(null);
  const [caption, setCaption] = useState('');
  const [alignment, setAlignment] = useState('center');

  useEffect(() => {
    fetch(`/api/${mediaCollection}?limit=100`)
      .then(r => r.json())
      .then(data => {
        setMediaList(data.docs || []);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [mediaCollection]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', file.name);
    try {
      const res = await fetch(`/api/${mediaCollection}`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.doc) {
        setMediaList([data.doc, ...mediaList]);
        setSelectedMedia(data.doc);
      }
    } catch (e) {
      console.error('Upload failed', e);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold">Media Library</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto">
            {loading && mediaList.length === 0 ? (
              <div className="flex justify-center items-center h-32"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                <label className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-lg flex flex-col items-center justify-center cursor-pointer aspect-square bg-slate-50">
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-600 font-medium">Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
                {mediaList.map((m: any) => (
                  <div key={m.id} onClick={() => { setSelectedMedia(m); setUsageStatus(null); fetch(`/api/media-usage?collection=${mediaCollection}&id=${m.id}`).then(r => r.json()).then(setUsageStatus).catch(console.error); }} className={`cursor-pointer relative aspect-square rounded-lg overflow-hidden border-2 ${selectedMedia?.id === m.id ? 'border-blue-500' : 'border-transparent'}`}>
                    <img src={m.url} alt={m.alt || 'Media'} className="w-full h-full object-cover" />
                    {selectedMedia?.id === m.id && <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center"><div className="bg-blue-500 rounded-full p-1"><Check className="w-4 h-4 text-white" /></div></div>}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {selectedMedia && (
            <div className="w-80 border-l border-slate-200 p-4 flex flex-col overflow-y-auto bg-slate-50">
              <h3 className="font-bold mb-4">Detail Media</h3>
              <img src={selectedMedia.url} className="w-full rounded mb-4" alt="Preview" />
              <div className="text-sm text-slate-500 mb-4">{selectedMedia.filename}</div>

              <div className="mb-4 p-3 bg-white rounded border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 mb-1 uppercase">Usage Status</div>
                {!usageStatus ? (
                  <div className="text-sm text-slate-400">Checking...</div>
                ) : usageStatus.used ? (
                  <div>
                    <div className="text-sm font-bold text-amber-600 mb-2">Used</div>
                    <div className="text-xs text-slate-600">Used by {usageStatus.references.length} contents:</div>
                    <ul className="mt-1 text-xs text-slate-500 list-disc pl-4">
                      {usageStatus.references.map((r: any, i: number) => (
                        <li key={i}>{r.type}: {r.title}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-bold text-green-600 mb-1">Unused</div>
                    <div className="text-xs text-slate-500">Belum digunakan oleh konten apa pun.</div>
                  </div>
                )}
              </div>

              
              <label className="block text-sm font-medium text-slate-700 mb-1">Caption (opsional)</label>
              <input type="text" value={caption} onChange={e => setCaption(e.target.value)} className="w-full border border-slate-300 rounded p-2 mb-4" placeholder="Teks di bawah gambar" />
              
              <label className="block text-sm font-medium text-slate-700 mb-1">Alignment</label>
              <select value={alignment} onChange={e => setAlignment(e.target.value)} className="w-full border border-slate-300 rounded p-2 mb-6">
                <option value="left">Kiri (Left)</option>
                <option value="center">Tengah (Center)</option>
                <option value="right">Kanan (Right)</option>
                <option value="full">Lebar Penuh (Full Width)</option>
              </select>
              
              <div className="mt-auto flex gap-2">
                <button onClick={() => onSelect(selectedMedia, caption, alignment)} className="flex-1 bg-blue-600 text-white rounded p-2 font-medium hover:bg-blue-700">Sisipkan</button>

                {usageStatus && !usageStatus.used && (
                  <button onClick={async () => {
                    if (!confirm("Hapus gambar?\n\nGambar ini belum digunakan oleh konten apa pun.\n\nTindakan ini akan menghapus gambar secara permanen.")) return;
                    try {
                      const res = await fetch(`/api/${mediaCollection}/${selectedMedia.id}`, { method: 'DELETE' });
                      if (!res.ok) throw new Error(await res.text());
                      setMediaList(mediaList.filter(m => m.id !== selectedMedia.id));
                      setSelectedMedia(null);
                    } catch (e: any) {
                      alert(e.message || 'Gagal menghapus');
                    }
                  }} className="flex-1 bg-red-50 text-red-600 rounded p-2 font-medium hover:bg-red-100 border border-red-200">Hapus dari Server</button>
                )}
                {usageStatus && usageStatus.used && (
                  <button onClick={() => {
                    alert("Gambar tidak dapat dihapus\n\nGambar ini masih digunakan oleh " + usageStatus.references.length + " konten.\n\nSilakan hapus atau ganti gambar pada konten tersebut terlebih dahulu.");
                  }} className="flex-1 bg-slate-100 text-slate-400 rounded p-2 font-medium cursor-not-allowed">Hapus dari Server</button>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ToolbarPlugin({ mediaCollection }: { mediaCollection: string }) {
  const [editor] = useLexicalComposerContext()
  const [isLink, setIsLink] = useState(false)
  const [showMediaModal, setShowMediaModal] = useState(false)

  const formatHeading = (level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') => {
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

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode())
      }
    })
  }
  
  const formatCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode())
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
    <button type="button" onClick={onClick} title={title} className="p-2 text-slate-600 hover:bg-slate-200 rounded-md transition-colors flex items-center justify-center">
      <Icon className="w-4 h-4" />
    </button>
  )
  
  const Divider = () => <div className="w-px h-6 bg-slate-300 mx-1" />

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-md">
        <ToolbarButton onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} icon={Undo} title="Undo" />
        <ToolbarButton onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} icon={Redo} title="Redo" />
        <Divider />
        
        <select onChange={(e) => {
          const val = e.target.value;
          if (val === 'p') formatParagraph();
          else if (val === 'quote') formatQuote();
          else if (val === 'code') formatCodeBlock();
          else if (val) formatHeading(val as any);
          e.target.value = '';
        }} className="p-1.5 text-sm bg-transparent hover:bg-slate-200 rounded-md outline-none cursor-pointer text-slate-700 font-medium">
          <option value="">Paragraph & Heading...</option>
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="quote">Quote / Blockquote</option>
          <option value="code">Code Block</option>
        </select>
        
        <Divider />
        <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} icon={Bold} title="Bold" />
        <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} icon={Italic} title="Italic" />
        <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')} icon={Underline} title="Underline" />
        <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')} icon={Strikethrough} title="Strikethrough" />
        <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')} icon={Code} title="Inline Code" />
        <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')} icon={Subscript} title="Subscript" />
        <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')} icon={Superscript} title="Superscript" />
        
        <Divider />
        <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')} icon={AlignLeft} title="Align Left" />
        <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')} icon={AlignCenter} title="Align Center" />
        <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')} icon={AlignRight} title="Align Right" />
        <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')} icon={AlignJustify} title="Justify" />
        
        <Divider />
        <ToolbarButton onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} icon={List} title="Bullet List" />
        <ToolbarButton onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} icon={ListOrdered} title="Numbered List" />
        
        <Divider />
        <ToolbarButton onClick={insertLink} icon={LinkIcon} title="Link" />
        <ToolbarButton onClick={() => setShowMediaModal(true)} icon={ImageIcon} title="Image" />
        <ToolbarButton onClick={() => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)} icon={Minus} title="Horizontal Rule" />
      </div>

      {showMediaModal && (
        <MediaLibraryModal 
          mediaCollection={mediaCollection}
          onClose={() => setShowMediaModal(false)} 
          onSelect={(media, caption, alignment) => {
            editor.dispatchCommand(INSERT_UPLOAD_COMMAND, {
              id: media.id,
              url: media.url,
              alt: media.alt || media.filename || 'Image',
              caption,
              alignment,
              relationTo: mediaCollection
            });
            setShowMediaModal(false);
          }} 
        />
      )}
    </>
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
  onChange,
  mediaCollection = 'media'
}: { 
  initialData?: any, 
  onChange: (json: any) => void,
  mediaCollection?: string
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
      LinkNode,
      HorizontalRuleNode,
      CodeNode,
      UploadNode
    ],
  }

  const handleChange = (editorState: any) => {
    editorState.read(() => {
      const json = editorState.toJSON()
      onChange(json)
    })
  }

  return (
    <div className="border border-slate-300 rounded-md bg-white overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin mediaCollection={mediaCollection} />
        <div className="relative p-4 min-h-[400px]">
          <RichTextPlugin
            contentEditable={<ContentEditable className="outline-none min-h-[400px] prose max-w-none prose-slate" />}
            placeholder={<div className="absolute top-4 left-4 text-slate-400 pointer-events-none">Mulai mengetik...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <HorizontalRulePlugin />
          <UploadPlugin />
          <OnChangePlugin onChange={handleChange} />
          {initialData && <InitialStatePlugin initialJson={initialData} />}
        </div>
      </LexicalComposer>
    </div>
  )
}
