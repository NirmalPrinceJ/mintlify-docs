import React from 'react';
import { Search, Sun, Moon, Sparkles, Menu, X, ExternalLink } from 'lucide-react';
import { DocsConfig } from '../types';

interface NavbarProps {
  config: DocsConfig;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenContextual: () => void;
  onToggleMobileMenu: () => void;
  mobileMenuOpen: boolean;
  onSelectPage: (pageId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  darkMode,
  onToggleTheme,
  onOpenSearch,
  onOpenContextual,
  onToggleMobileMenu,
  mobileMenuOpen,
  onSelectPage,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-[#0c1015]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <button
            id="mobile-menu-btn"
            onClick={onToggleMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 lg:hidden dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <button
            onClick={() => onSelectPage('index')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white shadow-sm shadow-emerald-600/30">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-semibold text-zinc-900 dark:text-white">
                {config.name || 'Mintlify Docs'}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                Starter
              </span>
            </div>
          </button>
        </div>

        {/* Center: Search Bar Trigger */}
        <div className="hidden flex-1 max-w-md px-8 md:block">
          <button
            id="search-trigger-btn"
            onClick={onOpenSearch}
            className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/75 px-3.5 py-2 text-sm text-zinc-500 shadow-xs transition-colors hover:border-zinc-300 hover:bg-zinc-100/75 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/60"
          >
            <div className="flex items-center gap-2.5">
              <Search size={15} className="text-zinc-400 dark:text-zinc-500" />
              <span>Search documentation...</span>
            </div>
            <kbd className="hidden rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-zinc-500 shadow-xs sm:inline-block dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search icon */}
          <button
            onClick={onOpenSearch}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Contextual / AI prompts trigger */}
          <button
            id="contextual-menu-btn"
            onClick={onOpenContextual}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Ask AI & Contextual Actions"
          >
            <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>AI & Tools</span>
          </button>

          {/* Custom Navbar Links from docs.json */}
          {config.navbar?.links?.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white px-2 py-1"
            >
              <span>{link.label}</span>
              {link.href.startsWith('http') && <ExternalLink size={12} className="opacity-60" />}
            </a>
          ))}

          {/* Theme toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Primary CTA button from docs.json */}
          {config.navbar?.primary && (
            <a
              id="navbar-primary-cta"
              href={config.navbar.primary.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              {config.navbar.primary.label}
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
