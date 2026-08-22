import React, { useEffect, useState } from 'react';
import { AlignLeft } from 'lucide-react';
import { TocHeading } from '../types';
import { parseFrontmatter } from '../lib/docs-data';

interface TableOfContentsProps {
  rawContent: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ rawContent }) => {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const { body } = parseFrontmatter(rawContent);
    const lines = body.split('\n');
    const extracted: TocHeading[] = [];

    lines.forEach((line) => {
      if (line.startsWith('## ')) {
        const text = line.replace(/^##\s+/, '').trim();
        const id = text.toLowerCase().replace(/[^\w]+/g, '-');
        extracted.push({ id, text, level: 2 });
      } else if (line.startsWith('### ')) {
        const text = line.replace(/^###\s+/, '').trim();
        const id = text.toLowerCase().replace(/[^\w]+/g, '-');
        extracted.push({ id, text, level: 3 });
      }
    });

    setHeadings(extracted);
    if (extracted.length > 0) {
      setActiveId(extracted[0].id);
    }
  }, [rawContent]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 100;
      for (let i = headings.length - 1; i >= 0; i--) {
        const el = document.getElementById(headings[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="sticky top-20 hidden w-60 shrink-0 xl:block">
      <div className="space-y-3 pl-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          <AlignLeft size={14} />
          <span>On this page</span>
        </div>
        <nav className="space-y-1 text-sm border-l border-zinc-200 dark:border-zinc-800 pl-3">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(h.id);
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                  setActiveId(h.id);
                }
              }}
              className={`block transition-colors ${
                h.level === 3 ? 'pl-3 text-xs' : ''
              } ${
                activeId === h.id
                  ? 'font-medium text-emerald-600 dark:text-emerald-400'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};
