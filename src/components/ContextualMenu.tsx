import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  FileCode, 
  Bot, 
  ExternalLink, 
  Sparkles,
  Terminal,
  Cpu
} from 'lucide-react';
import { DocPage } from '../types';

interface ContextualMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: DocPage;
}

export const ContextualMenu: React.FC<ContextualMenuProps> = ({
  isOpen,
  onClose,
  currentPage,
}) => {
  const [copiedAction, setCopiedAction] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(currentPage.content);
    setCopiedAction('raw');
    setTimeout(() => setCopiedAction(null), 2000);
  };

  const handleCopyPrompt = (toolName: string) => {
    const prompt = `Here is the documentation page for "${currentPage.title}":\n\n${currentPage.content}\n\nPlease analyze this guide and help me implement or configure it.`;
    navigator.clipboard.writeText(prompt);
    setCopiedAction(toolName);
    setTimeout(() => setCopiedAction(null), 2000);
  };

  const openAIChat = (urlTemplate: string, toolName: string) => {
    const prompt = `Here is the Mintlify documentation for "${currentPage.title}":\n\n${currentPage.content}`;
    window.open(urlTemplate + encodeURIComponent(prompt), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-[#12161c]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                AI & Contextual Tools
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Page: {currentPage.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action List */}
        <div className="space-y-4 p-6">
          {/* Quick Copy Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCopyRaw}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5 text-left transition-colors hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-emerald-950/20"
            >
              <div className="flex items-center gap-2.5">
                <FileCode size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Copy Page MDX
                </span>
              </div>
              {copiedAction === 'raw' ? (
                <Check size={14} className="text-emerald-500" />
              ) : (
                <Copy size={14} className="text-zinc-400" />
              )}
            </button>

            <button
              onClick={() => handleCopyPrompt('prompt')}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5 text-left transition-colors hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-emerald-950/20"
            >
              <div className="flex items-center gap-2.5">
                <Bot size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Copy AI Prompt
                </span>
              </div>
              {copiedAction === 'prompt' ? (
                <Check size={14} className="text-emerald-500" />
              ) : (
                <Copy size={14} className="text-zinc-400" />
              )}
            </button>
          </div>

          {/* AI Assistants */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Open in AI Assistant
            </span>
            <div className="mt-2 space-y-2">
              <button
                onClick={() => openAIChat('https://chatgpt.com/?q=', 'chatgpt')}
                className="flex w-full items-center justify-between rounded-xl border border-zinc-200 p-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/40"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Ask ChatGPT</span>
                </div>
                <ExternalLink size={14} className="text-zinc-400" />
              </button>

              <button
                onClick={() => openAIChat('https://claude.ai/new?q=', 'claude')}
                className="flex w-full items-center justify-between rounded-xl border border-zinc-200 p-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/40"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Ask Claude</span>
                </div>
                <ExternalLink size={14} className="text-zinc-400" />
              </button>

              <button
                onClick={() => openAIChat('https://www.perplexity.ai/search?q=', 'perplexity')}
                className="flex w-full items-center justify-between rounded-xl border border-zinc-200 p-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/40"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-teal-500" />
                  <span>Ask Perplexity</span>
                </div>
                <ExternalLink size={14} className="text-zinc-400" />
              </button>
            </div>
          </div>

          {/* Developer Tools (MCP & IDEs) */}
          <div className="border-t border-zinc-200/80 pt-4 dark:border-zinc-800/80">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Developer Protocol & IDEs
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  <Cpu size={14} className="text-emerald-500" />
                  <span>Mintlify MCP</span>
                </div>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  https://mcp.mintlify.com
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  <Terminal size={14} className="text-emerald-500" />
                  <span>Mintlify CLI</span>
                </div>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                  mint dev
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
