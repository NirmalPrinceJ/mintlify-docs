import React from 'react';
import { 
  FileText, 
  Rocket, 
  Puzzle, 
  Code, 
  BookOpen, 
  Newspaper, 
  ExternalLink,
  PlusCircle,
  FolderOpen
} from 'lucide-react';
import { DocsConfig, DocPage } from '../types';

interface SidebarProps {
  config: DocsConfig;
  pages: Record<string, DocPage>;
  activePageId: string;
  onSelectPage: (pageId: string) => void;
  onOpenEditor: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  pages,
  activePageId,
  onSelectPage,
  onOpenEditor,
  isOpenMobile,
  onCloseMobile,
}) => {
  const getPageIcon = (pageId: string) => {
    switch (pageId) {
      case 'index':
        return <BookOpen size={16} className="shrink-0" />;
      case 'quickstart':
        return <Rocket size={16} className="shrink-0" />;
      case 'components':
        return <Puzzle size={16} className="shrink-0" />;
      case 'api-reference':
        return <Code size={16} className="shrink-0" />;
      default:
        return <FileText size={16} className="shrink-0" />;
    }
  };

  const content = (
    <div className="flex h-full flex-col justify-between py-6">
      <div className="space-y-6">
        {/* Navigation Groups from docs.json */}
        {config.navigation.pages.map((item, idx) => {
          if (typeof item === 'string') {
            const page = pages[item];
            const isActive = activePageId === item;
            return (
              <div key={idx} className="px-3">
                <button
                  onClick={() => {
                    onSelectPage(item);
                    onCloseMobile?.();
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200'
                  }`}
                >
                  {getPageIcon(item)}
                  <span className="truncate">{page?.title || item}</span>
                </button>
              </div>
            );
          }

          return (
            <div key={idx} className="space-y-1.5 px-3">
              <div className="flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                <FolderOpen size={13} className="opacity-70" />
                <span>{item.group}</span>
              </div>
              <div className="space-y-0.5">
                {item.pages.map((pageKey) => {
                  const page = pages[pageKey];
                  const isActive = activePageId === pageKey;
                  return (
                    <button
                      key={pageKey}
                      onClick={() => {
                        onSelectPage(pageKey);
                        onCloseMobile?.();
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-emerald-50 font-semibold text-emerald-700 shadow-xs dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200'
                      }`}
                    >
                      {getPageIcon(pageKey)}
                      <span className="truncate text-left">{page?.title || pageKey}</span>
                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Global Anchors from docs.json */}
        {config.navigation.global?.anchors && config.navigation.global.anchors.length > 0 && (
          <div className="space-y-1.5 border-t border-zinc-200/80 px-3 pt-4 dark:border-zinc-800/80">
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Resources
            </div>
            <div className="space-y-0.5">
              {config.navigation.global.anchors.map((anchor, i) => (
                <a
                  key={i}
                  href={anchor.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200"
                >
                  <div className="flex items-center gap-2.5">
                    {anchor.icon === 'newspaper' ? (
                      <Newspaper size={16} />
                    ) : (
                      <BookOpen size={16} />
                    )}
                    <span>{anchor.anchor}</span>
                  </div>
                  <ExternalLink size={13} className="text-zinc-400 opacity-70" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom helper card / Editor trigger */}
      <div className="mt-8 border-t border-zinc-200/80 px-4 pt-4 dark:border-zinc-800/80">
        <button
          onClick={onOpenEditor}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-50/50 p-2.5 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100/60 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
        >
          <PlusCircle size={15} />
          <span>Interactive MDX Editor</span>
        </button>
        <p className="mt-2 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
          Mintlify Starter Kit v1.0
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-zinc-200/80 lg:block dark:border-zinc-800/80">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl dark:bg-[#0c1015]">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
