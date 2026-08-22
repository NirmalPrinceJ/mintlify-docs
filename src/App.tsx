import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ThumbsUp, 
  ThumbsDown, 
  Edit3, 
  Sparkles,
  BookOpen,
  Globe,
  Share2
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MdxRenderer } from './components/MdxRenderer';
import { TableOfContents } from './components/TableOfContents';
import { SearchModal } from './components/SearchModal';
import { ContextualMenu } from './components/ContextualMenu';
import { DocEditorModal } from './components/DocEditorModal';
import { initialDocsConfig, initialDocPages } from './lib/docs-data';
import { DocsConfig, DocPage } from './types';

export function App() {
  const [config, setConfig] = useState<DocsConfig>(initialDocsConfig);
  const [pages, setPages] = useState<Record<string, DocPage>>(initialDocPages);
  const [activePageId, setActivePageId] = useState<string>('index');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isContextualOpen, setIsContextualOpen] = useState<boolean>(false);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);

  // Initialize theme from preference
  useEffect(() => {
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  // Update HTML dark class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset feedback on page change
  useEffect(() => {
    setFeedbackGiven(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePageId]);

  const currentPage = pages[activePageId] || pages['index'] || {
    id: 'index',
    title: 'Not Found',
    content: '# Page Not Found\n\nThe requested documentation page could not be located.',
  };

  // Compute Prev / Next navigation
  const flatPageKeys: string[] = [];
  config.navigation.pages.forEach((item) => {
    if (typeof item === 'string') {
      flatPageKeys.push(item);
    } else if (item && Array.isArray(item.pages)) {
      flatPageKeys.push(...item.pages);
    }
  });

  const currentIndex = flatPageKeys.indexOf(activePageId);
  const prevPageKey = currentIndex > 0 ? flatPageKeys[currentIndex - 1] : null;
  const nextPageKey = currentIndex !== -1 && currentIndex < flatPageKeys.length - 1 ? flatPageKeys[currentIndex + 1] : null;

  const prevPage = prevPageKey ? pages[prevPageKey] : null;
  const nextPage = nextPageKey ? pages[nextPageKey] : null;

  const handleSavePage = (savedPage: DocPage) => {
    setPages((prev) => ({
      ...prev,
      [savedPage.id]: savedPage,
    }));

    // If new page not in nav, add it to nav
    if (!flatPageKeys.includes(savedPage.id)) {
      setConfig((prev) => ({
        ...prev,
        navigation: {
          ...prev.navigation,
          pages: [
            ...prev.navigation.pages,
            {
              group: savedPage.group || 'Custom Guides',
              pages: [savedPage.id],
            },
          ],
        },
      }));
    }

    setActivePageId(savedPage.id);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 transition-colors duration-150 dark:bg-[#0c1015] dark:text-zinc-100">
      {/* Top Navbar */}
      <Navbar
        config={config}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenContextual={() => setIsContextualOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        mobileMenuOpen={isMobileMenuOpen}
        onSelectPage={setActivePageId}
      />

      {/* Main Container */}
      <div className="mx-auto flex max-w-7xl">
        {/* Left Sidebar */}
        <Sidebar
          config={config}
          pages={pages}
          activePageId={activePageId}
          onSelectPage={setActivePageId}
          onOpenEditor={() => setIsEditorOpen(true)}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Center Content + Right TOC */}
        <main className="flex min-w-0 flex-1 justify-center px-4 py-6 sm:px-8 lg:px-12">
          <div className="w-full max-w-3xl min-w-0">
            {/* Action Bar (Edit & AI) */}
            <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 text-xs text-zinc-500 dark:border-zinc-800/60 dark:text-zinc-400">
              <div className="flex items-center gap-1.5 font-medium">
                <BookOpen size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>{currentPage.group || 'Documentation'}</span>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-200">{currentPage.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="page-editor-trigger"
                  onClick={() => setIsEditorOpen(true)}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                  <Edit3 size={13} />
                  <span>Edit this page</span>
                </button>
                <button
                  onClick={() => setIsContextualOpen(true)}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                >
                  <Sparkles size={13} />
                  <span>AI Actions</span>
                </button>
              </div>
            </div>

            {/* Rendered MDX Document */}
            <MdxRenderer 
              content={currentPage.content} 
              onNavigate={(pageId) => setActivePageId(pageId)} 
            />

            {/* Pagination Controls (Prev / Next) */}
            <div className="mt-12 flex flex-col gap-4 border-t border-zinc-200/80 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800/80">
              {prevPage ? (
                <button
                  id="prev-page-button"
                  onClick={() => setActivePageId(prevPage.id)}
                  className="group flex flex-col items-start rounded-xl border border-zinc-200/80 p-4 text-left transition-all hover:border-emerald-500/50 hover:bg-zinc-50 dark:border-zinc-800/80 dark:hover:border-emerald-500/40 dark:hover:bg-zinc-900/40"
                >
                  <span className="flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    <ArrowLeft size={13} />
                    <span>Previous</span>
                  </span>
                  <span className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {prevPage.title}
                  </span>
                </button>
              ) : <div />}

              {nextPage && (
                <button
                  id="next-page-button"
                  onClick={() => setActivePageId(nextPage.id)}
                  className="group flex flex-col items-end rounded-xl border border-zinc-200/80 p-4 text-right transition-all hover:border-emerald-500/50 hover:bg-zinc-50 dark:border-zinc-800/80 dark:hover:border-emerald-500/40 dark:hover:bg-zinc-900/40 sm:ml-auto"
                >
                  <span className="flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    <span>Next</span>
                    <ArrowRight size={13} />
                  </span>
                  <span className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {nextPage.title}
                  </span>
                </button>
              )}
            </div>

            {/* Helpful Feedback Section */}
            <div className="mt-10 flex items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/30">
              <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Was this documentation page helpful?
              </div>
              <div className="flex items-center gap-2">
                {feedbackGiven ? (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Thank you for your feedback!
                  </span>
                ) : (
                  <>
                    <button
                      id="feedback-yes-btn"
                      onClick={() => setFeedbackGiven('yes')}
                      className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-emerald-400"
                    >
                      <ThumbsUp size={13} />
                      <span>Yes</span>
                    </button>
                    <button
                      id="feedback-no-btn"
                      onClick={() => setFeedbackGiven('no')}
                      className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:border-rose-500 hover:text-rose-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-rose-400"
                    >
                      <ThumbsDown size={13} />
                      <span>No</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-16 border-t border-zinc-200/80 py-8 text-xs text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-500">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p>
                  Powered by <a href="https://mintlify.com" target="_blank" rel="noreferrer" className="font-semibold text-zinc-700 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400">Mintlify</a>
                </p>
                <div className="flex items-center gap-4">
                  {config.footer?.socials?.x && (
                    <a href={config.footer.socials.x} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white" aria-label="X">
                      <span className="font-semibold text-xs">𝕏</span>
                    </a>
                  )}
                  {config.footer?.socials?.github && (
                    <a href={config.footer.socials.github} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white" aria-label="GitHub">
                      <span className="font-semibold text-xs">GitHub</span>
                    </a>
                  )}
                  {config.footer?.socials?.linkedin && (
                    <a href={config.footer.socials.linkedin} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white" aria-label="LinkedIn">
                      <span className="font-semibold text-xs">LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </footer>
          </div>

          {/* Right Table of Contents */}
          <TableOfContents rawContent={currentPage.content} />
        </main>
      </div>

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        pages={pages}
        onSelectPage={setActivePageId}
      />

      <ContextualMenu
        isOpen={isContextualOpen}
        onClose={() => setIsContextualOpen(false)}
        currentPage={currentPage}
      />

      <DocEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        currentPage={currentPage}
        onSavePage={handleSavePage}
      />
    </div>
  );
}
