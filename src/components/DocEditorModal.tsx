import React, { useState } from 'react';
import { X, Save, Eye, Code, Plus } from 'lucide-react';
import { DocPage } from '../types';
import { MdxRenderer } from './MdxRenderer';

interface DocEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: DocPage;
  onSavePage: (page: DocPage) => void;
}

export const DocEditorModal: React.FC<DocEditorModalProps> = ({
  isOpen,
  onClose,
  currentPage,
  onSavePage,
}) => {
  const [content, setContent] = useState(currentPage.content);
  const [title, setTitle] = useState(currentPage.title);
  const [id, setId] = useState(currentPage.id);
  const [mode, setMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Sync state if currentPage changes
  React.useEffect(() => {
    setContent(currentPage.content);
    setTitle(currentPage.title);
    setId(currentPage.id);
    setIsCreatingNew(false);
  }, [currentPage]);

  if (!isOpen) return null;

  const handleStartNew = () => {
    setIsCreatingNew(true);
    setId('custom-guide');
    setTitle('Custom Guide');
    setContent(`---
title: "Custom Guide"
description: "A brand new documentation page"
---

Welcome to your new guide! Start writing your docs below.

<Tip>
  You can use standard Markdown as well as Mintlify components like <Tip>, <Card>, <Steps>, and <Accordion>!
</Tip>

## Section 1

Write your content here.

\`\`\`bash
npm run dev
\`\`\`
`);
  };

  const handleSave = () => {
    onSavePage({
      id: isCreatingNew ? id.toLowerCase().replace(/[^\w\-]/g, '') : currentPage.id,
      title,
      content,
      group: currentPage.group || 'Custom Pages',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Full Modal Box */}
      <div className="relative flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-[#12161c]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-3.5 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              {isCreatingNew ? 'Create New MDX Page' : `Editing: ${currentPage.id}.mdx`}
            </h2>
            {!isCreatingNew && (
              <button
                onClick={handleStartNew}
                className="flex items-center gap-1 rounded-lg border border-dashed border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-600 hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-emerald-400"
              >
                <Plus size={13} />
                <span>New Page</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher */}
            <div className="flex rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-800">
              <button
                onClick={() => setMode('edit')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${
                  mode === 'edit'
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                }`}
              >
                <Code size={13} />
                <span>Code</span>
              </button>
              <button
                onClick={() => setMode('split')}
                className={`hidden sm:flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${
                  mode === 'split'
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                }`}
              >
                <span>Split</span>
              </button>
              <button
                onClick={() => setMode('preview')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${
                  mode === 'preview'
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                }`}
              >
                <Eye size={13} />
                <span>Preview</span>
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              <Save size={14} />
              <span>Apply & Save</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden sm:grid-cols-2">
          {/* Editor Area */}
          {(mode === 'edit' || mode === 'split') && (
            <div className={`flex flex-col border-r border-zinc-200 dark:border-zinc-800 ${mode === 'edit' ? 'col-span-2 sm:col-span-2' : ''}`}>
              <div className="border-b border-zinc-200 bg-zinc-50/50 px-4 py-2 text-xs font-mono text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40">
                Markdown & MDX Source
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-full w-full resize-none bg-white p-4 font-mono text-xs leading-relaxed text-zinc-900 focus:outline-none dark:bg-[#0d1117] dark:text-zinc-200 sm:text-sm"
                spellCheck={false}
              />
            </div>
          )}

          {/* Preview Area */}
          {(mode === 'preview' || mode === 'split') && (
            <div className={`overflow-y-auto bg-zinc-50/30 p-6 dark:bg-[#0c1015] ${mode === 'preview' ? 'col-span-2 sm:col-span-2' : ''}`}>
              <div className="mb-4 rounded-md border border-zinc-200/80 bg-white/50 px-3 py-1.5 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400">
                Live Rendered Output
              </div>
              <MdxRenderer content={content} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
