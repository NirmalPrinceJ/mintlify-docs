import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, ArrowRight } from 'lucide-react';
import { DocPage } from '../types';
import { parseFrontmatter } from '../lib/docs-data';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: Record<string, DocPage>;
  onSelectPage: (pageId: string) => void;
}

interface SearchResult {
  pageId: string;
  title: string;
  description?: string;
  snippet?: string;
  group?: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  pages,
  onSelectPage,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      // Default: show all pages
      const defaultResults = Object.values(pages).map((p) => {
        const { title, description } = parseFrontmatter(p.content);
        return {
          pageId: p.id,
          title: title || p.title,
          description: description || p.description,
          group: p.group,
        };
      });
      setResults(defaultResults);
      setSelectedIndex(0);
      return;
    }

    const q = query.toLowerCase();
    const matched: SearchResult[] = [];

    Object.values(pages).forEach((page) => {
      const { title, description, body } = parseFrontmatter(page.content);
      const pageTitle = (title || page.title).toLowerCase();
      const pageDesc = (description || page.description || '').toLowerCase();
      const pageBody = body.toLowerCase();

      if (pageTitle.includes(q) || pageDesc.includes(q) || pageBody.includes(q)) {
        // Find matching snippet in body
        let snippet: string | undefined;
        const index = pageBody.indexOf(q);
        if (index !== -1) {
          const start = Math.max(0, index - 30);
          const end = Math.min(pageBody.length, index + 70);
          snippet = '...' + pageBody.substring(start, end).replace(/\n/g, ' ') + '...';
        }

        matched.push({
          pageId: page.id,
          title: title || page.title,
          description: description || page.description,
          snippet,
          group: page.group,
        });
      }
    });

    setResults(matched);
    setSelectedIndex(0);
  }, [query, pages]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        onSelectPage(results[selectedIndex].pageId);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Dialog box */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-[#12161c]">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-zinc-200 px-4 dark:border-zinc-800">
          <Search size={18} className="text-zinc-400 dark:text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search documentation, guides, and components..."
            className="h-14 w-full bg-transparent px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-white dark:placeholder:text-zinc-500"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X size={16} />
            </button>
          )}
          <kbd className="ml-2 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No documentation pages found for <span className="font-semibold">"{query}"</span>
            </div>
          ) : (
            results.map((res, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={res.pageId}
                  onClick={() => {
                    onSelectPage(res.pageId);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex w-full items-start justify-between rounded-xl p-3 text-left transition-colors ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200'
                      : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-lg p-1.5 ${
                      isSelected 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                        : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{res.title}</span>
                        {res.group && (
                          <span className="rounded-full bg-zinc-200/60 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                            {res.group}
                          </span>
                        )}
                      </div>
                      {res.description && (
                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                          {res.description}
                        </p>
                      )}
                      {res.snippet && (
                        <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono line-clamp-1">
                          {res.snippet}
                        </p>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <ArrowRight size={16} className="mt-1 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-4 py-2 text-[11px] text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-500">
          <div className="flex items-center gap-2">
            <span>Navigate <kbd className="font-mono">↑↓</kbd></span>
            <span>Select <kbd className="font-mono">↵</kbd></span>
          </div>
          <span>Mintlify Fast Search</span>
        </div>
      </div>
    </div>
  );
};
