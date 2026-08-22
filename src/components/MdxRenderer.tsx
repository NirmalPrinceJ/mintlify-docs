import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  Lightbulb, 
  Info as InfoIcon, 
  AlertTriangle, 
  StickyNote, 
  ChevronRight, 
  ChevronDown,
  Rocket,
  Puzzle,
  Settings,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { parseFrontmatter } from '../lib/docs-data';

interface MdxRendererProps {
  content: string;
  onNavigate?: (pageId: string) => void;
}

export const MdxRenderer: React.FC<MdxRendererProps> = ({ content, onNavigate }) => {
  const { title, description, body } = parseFrontmatter(content);

  return (
    <div className="mx-auto max-w-3xl py-8">
      {/* Page Header */}
      <header className="mb-8 border-b border-zinc-200/80 pb-6 dark:border-zinc-800/80">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        )}
      </header>

      {/* Main Body */}
      <div className="space-y-6 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        <ParsedContent rawText={body} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

/* Component to parse and render blocks */
const ParsedContent: React.FC<{ rawText: string; onNavigate?: (pageId: string) => void }> = ({
  rawText,
  onNavigate,
}) => {
  const blocks = splitIntoBlocks(rawText);

  return (
    <>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'tip':
            return (
              <Callout key={idx} variant="tip" title="Tip">
                <ParsedContent rawText={block.content} onNavigate={onNavigate} />
              </Callout>
            );
          case 'info':
            return (
              <Callout key={idx} variant="info" title="Info">
                <ParsedContent rawText={block.content} onNavigate={onNavigate} />
              </Callout>
            );
          case 'warning':
            return (
              <Callout key={idx} variant="warning" title="Warning">
                <ParsedContent rawText={block.content} onNavigate={onNavigate} />
              </Callout>
            );
          case 'note':
            return (
              <Callout key={idx} variant="note" title="Note">
                <ParsedContent rawText={block.content} onNavigate={onNavigate} />
              </Callout>
            );
          case 'card':
            return (
              <DocCard
                key={idx}
                title={block.props.title || 'Card'}
                icon={block.props.icon}
                href={block.props.href}
                onNavigate={onNavigate}
              >
                {block.content}
              </DocCard>
            );
          case 'steps':
            return (
              <StepsContainer key={idx} rawSteps={block.content} onNavigate={onNavigate} />
            );
          case 'tabs':
            return (
              <TabsContainer key={idx} rawTabs={block.content} onNavigate={onNavigate} />
            );
          case 'accordion':
            return (
              <AccordionItem key={idx} title={block.props.title || 'Details'}>
                <ParsedContent rawText={block.content} onNavigate={onNavigate} />
              </AccordionItem>
            );
          case 'param-field':
            return (
              <ParamFieldView
                key={idx}
                name={block.props.path || block.props.query || block.props.body || block.props.name || 'parameter'}
                type={block.props.type}
                required={block.props.required !== undefined}
                kind={block.props.path ? 'path' : block.props.query ? 'query' : 'body'}
              >
                {block.content}
              </ParamFieldView>
            );
          case 'response-field':
            return (
              <ResponseFieldView
                key={idx}
                name={block.props.name || 'response'}
                type={block.props.type}
              >
                {block.content}
              </ResponseFieldView>
            );
          case 'code':
            return (
              <CodeBlock
                key={idx}
                code={block.content}
                language={block.props.language || 'bash'}
              />
            );
          case 'markdown':
          default:
            return <MarkdownSegment key={idx} text={block.content} onNavigate={onNavigate} />;
        }
      })}
    </>
  );
};

/* Simple Markdown Segment Renderer */
const MarkdownSegment: React.FC<{ text: string; onNavigate?: (pageId: string) => void }> = ({
  text,
  onNavigate,
}) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let isNumbered = false;

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      if (isNumbered) {
        elements.push(
          <ol key={key} className="my-4 ml-6 list-decimal space-y-2">
            {listItems.map((item, i) => (
              <li key={i}>{formatInline(item, onNavigate)}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={key} className="my-4 ml-6 list-disc space-y-2">
            {listItems.map((item, i) => (
              <li key={i}>{formatInline(item, onNavigate)}</li>
            ))}
          </ul>
        );
      }
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Heading 2
    if (line.startsWith('## ')) {
      flushList(`list-${i}`);
      const headingText = line.replace(/^##\s+/, '').trim();
      const id = headingText.toLowerCase().replace(/[^\w]+/g, '-');
      elements.push(
        <h2
          key={`h2-${i}`}
          id={id}
          className="group mt-10 mb-4 scroll-mt-24 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          <a href={`#${id}`} className="hover:underline flex items-center gap-2">
            <span>{headingText}</span>
            <span className="text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100">#</span>
          </a>
        </h2>
      );
      continue;
    }

    // Heading 3
    if (line.startsWith('### ')) {
      flushList(`list-${i}`);
      const headingText = line.replace(/^###\s+/, '').trim();
      const id = headingText.toLowerCase().replace(/[^\w]+/g, '-');
      elements.push(
        <h3
          key={`h3-${i}`}
          id={id}
          className="group mt-8 mb-3 scroll-mt-24 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          <a href={`#${id}`} className="hover:underline flex items-center gap-2">
            <span>{headingText}</span>
            <span className="text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100">#</span>
          </a>
        </h3>
      );
      continue;
    }

    // Unordered List item
    if (line.match(/^[\-\*]\s+/)) {
      if (isNumbered && listItems.length > 0) flushList(`list-${i}`);
      isNumbered = false;
      listItems.push(line.replace(/^[\-\*]\s+/, ''));
      continue;
    }

    // Ordered List item
    if (line.match(/^\d+\.\s+/)) {
      if (!isNumbered && listItems.length > 0) flushList(`list-${i}`);
      isNumbered = true;
      listItems.push(line.replace(/^\d+\.\s+/, ''));
      continue;
    }

    // Empty line or regular paragraph
    flushList(`list-${i}`);
    if (line.trim().length > 0) {
      elements.push(
        <p key={`p-${i}`} className="my-3 leading-relaxed">
          {formatInline(line, onNavigate)}
        </p>
      );
    }
  }
  flushList('final-list');

  return <>{elements}</>;
};

/* Format inline markdown: bold, code, links */
function formatInline(str: string, onNavigate?: (pageId: string) => void): React.ReactNode {
  // Regex to match code `...`, bold **...**, links [...](...)
  const parts: React.ReactNode[] = [];
  let remaining = str;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // Check link [text](href)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkHref = linkMatch[2];
      
      const isInternal = linkHref.startsWith('/') && !linkHref.startsWith('//');
      
      parts.push(
        <a
          key={keyIndex++}
          href={linkHref}
          onClick={(e) => {
            if (isInternal && onNavigate) {
              e.preventDefault();
              const pageId = linkHref.replace(/^\//, '') || 'index';
              onNavigate(pageId);
            }
          }}
          target={isInternal ? '_self' : '_blank'}
          rel="noreferrer"
          className="font-medium text-emerald-600 underline decoration-emerald-500/30 underline-offset-2 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          {linkText}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Check code `...`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(
        <code
          key={keyIndex++}
          className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs font-mono font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Check bold **...**
    const boldMatch = remaining.match(/^\*\*([^\*]+)\*\*/);
    if (boldMatch) {
      parts.push(
        <strong key={keyIndex++} className="font-semibold text-zinc-900 dark:text-white">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Regular character accumulation
    const nextSpecial = remaining.search(/(\[|`|\*\*)/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      // Just take one char to avoid infinite loop
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return <>{parts}</>;
}

/* Callout Component (<Tip>, <Info>, <Warning>, <Note>) */
interface CalloutProps {
  variant: 'tip' | 'info' | 'warning' | 'note';
  title?: string;
  children: React.ReactNode;
}

const Callout: React.FC<CalloutProps> = ({ variant, children }) => {
  const config = {
    tip: {
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-900 dark:text-emerald-200',
      icon: <Lightbulb className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
      label: 'Tip',
    },
    info: {
      bg: 'bg-sky-50/70 dark:bg-sky-950/20 border-sky-500/30 text-sky-900 dark:text-sky-200',
      icon: <InfoIcon className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0" />,
      label: 'Info',
    },
    warning: {
      bg: 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-500/30 text-amber-900 dark:text-amber-200',
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />,
      label: 'Warning',
    },
    note: {
      bg: 'bg-zinc-100/70 dark:bg-zinc-800/40 border-zinc-300/40 dark:border-zinc-700/50 text-zinc-800 dark:text-zinc-200',
      icon: <StickyNote className="h-5 w-5 text-zinc-600 dark:text-zinc-400 shrink-0" />,
      label: 'Note',
    },
  }[variant];

  return (
    <div className={`my-5 flex gap-3.5 rounded-xl border p-4 shadow-xs ${config.bg}`}>
      <div className="mt-0.5">{config.icon}</div>
      <div className="flex-1 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

/* Doc Card Component (<Card>) */
interface DocCardProps {
  title: string;
  icon?: string;
  href?: string;
  children: React.ReactNode;
  onNavigate?: (pageId: string) => void;
}

const DocCard: React.FC<DocCardProps> = ({ title, icon, href, children, onNavigate }) => {
  const getIcon = () => {
    switch (icon) {
      case 'rocket':
        return <Rocket size={20} className="text-emerald-600 dark:text-emerald-400" />;
      case 'puzzle-piece':
      case 'puzzle':
        return <Puzzle size={20} className="text-emerald-600 dark:text-emerald-400" />;
      case 'gear':
      case 'settings':
        return <Settings size={20} className="text-emerald-600 dark:text-emerald-400" />;
      default:
        return <BookOpen size={20} className="text-emerald-600 dark:text-emerald-400" />;
    }
  };

  const isInternal = href && href.startsWith('/') && !href.startsWith('//');

  const handleClick = (e: React.MouseEvent) => {
    if (href) {
      if (isInternal && onNavigate) {
        e.preventDefault();
        onNavigate(href.replace(/^\//, ''));
      }
    }
  };

  return (
    <a
      href={href || '#'}
      onClick={handleClick}
      target={isInternal ? '_self' : '_blank'}
      rel="noreferrer"
      className="group relative my-3.5 block rounded-xl border border-zinc-200/80 bg-white p-5 shadow-xs transition-all hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/5 dark:border-zinc-800/80 dark:bg-[#12161c] dark:hover:border-emerald-500/40"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
            {getIcon()}
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
              {title}
            </h3>
          </div>
        </div>
        {href && (
          <span className="text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600 dark:text-zinc-500 dark:group-hover:text-emerald-400">
            {isInternal ? <ChevronRight size={18} /> : <ExternalLink size={16} />}
          </span>
        )}
      </div>
      <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        {children}
      </div>
    </a>
  );
};

/* Steps Component (<Steps> & <Step>) */
const StepsContainer: React.FC<{ rawSteps: string; onNavigate?: (pageId: string) => void }> = ({
  rawSteps,
  onNavigate,
}) => {
  // Regex match individual <Step title="..."> ... </Step>
  const stepRegex = /<Step\s+title=["']([^"']+)["']>([\s\S]*?)<\/Step>/g;
  const steps: { title: string; content: string }[] = [];
  let match;
  while ((match = stepRegex.exec(rawSteps)) !== null) {
    steps.push({ title: match[1], content: match[2].trim() });
  }

  return (
    <div className="my-6 space-y-6 border-l-2 border-emerald-500/30 pl-6 ml-3 dark:border-emerald-500/20">
      {steps.map((step, idx) => (
        <div key={idx} className="relative">
          {/* Step Number Circle */}
          <div className="absolute -left-[35px] flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-xs dark:bg-emerald-500">
            {idx + 1}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {step.title}
            </h3>
            <div className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              <ParsedContent rawText={step.content} onNavigate={onNavigate} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* Tabs Component (<Tabs> & <Tab>) */
const TabsContainer: React.FC<{ rawTabs: string; onNavigate?: (pageId: string) => void }> = ({
  rawTabs,
  onNavigate,
}) => {
  const tabRegex = /<Tab\s+title=["']([^"']+)["']>([\s\S]*?)<\/Tab>/g;
  const tabs: { title: string; content: string }[] = [];
  let match;
  while ((match = tabRegex.exec(rawTabs)) !== null) {
    tabs.push({ title: match[1], content: match[2].trim() });
  }

  const [activeTab, setActiveTab] = useState(0);

  if (tabs.length === 0) return null;

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-50/50 dark:border-zinc-800/80 dark:bg-zinc-900/40">
      {/* Tab Headers */}
      <div className="flex border-b border-zinc-200/80 bg-zinc-100/60 px-2 pt-2 dark:border-zinc-800/80 dark:bg-zinc-900/80">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors ${
              activeTab === idx
                ? 'bg-white text-emerald-600 border-t border-x border-zinc-200/80 dark:bg-[#12161c] dark:text-emerald-400 dark:border-zinc-800/80'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      {/* Tab Body */}
      <div className="p-4">
        <ParsedContent rawText={tabs[activeTab].content} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

/* Accordion Component */
const AccordionItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-3 rounded-xl border border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-[#12161c]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left font-medium text-zinc-900 dark:text-white"
      >
        <span>{title}</span>
        {open ? <ChevronDown size={18} className="text-emerald-600" /> : <ChevronRight size={18} className="text-zinc-400" />}
      </button>
      {open && (
        <div className="border-t border-zinc-200/80 p-4 text-sm text-zinc-600 dark:border-zinc-800/80 dark:text-zinc-400">
          {children}
        </div>
      )}
    </div>
  );
};

/* ParamField Component */
const ParamFieldView: React.FC<{
  name: string;
  type?: string;
  required?: boolean;
  kind?: string;
  children: React.ReactNode;
}> = ({ name, type, required, kind, children }) => {
  return (
    <div className="my-4 border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
      <div className="flex flex-wrap items-center gap-2">
        <code className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 font-mono">
          {name}
        </code>
        {type && (
          <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 font-mono dark:bg-zinc-800 dark:text-zinc-400">
            {type}
          </span>
        )}
        {kind && (
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">
            {kind}
          </span>
        )}
        {required && (
          <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            required
          </span>
        )}
      </div>
      <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {children}
      </div>
    </div>
  );
};

/* ResponseField Component */
const ResponseFieldView: React.FC<{
  name: string;
  type?: string;
  children: React.ReactNode;
}> = ({ name, type, children }) => {
  return (
    <div className="my-4 border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
      <div className="flex items-center gap-2">
        <code className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 font-mono">
          {name}
        </code>
        {type && (
          <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 font-mono dark:bg-zinc-800 dark:text-zinc-400">
            {type}
          </span>
        )}
      </div>
      <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {children}
      </div>
    </div>
  );
};

/* Code Block with One-Click Copy */
interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-4 overflow-hidden rounded-xl border border-zinc-800/90 bg-[#0d1117] text-zinc-200 shadow-md">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-[#161b22] px-4 py-2 text-xs font-mono text-zinc-400">
        <span>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <pre className="overflow-x-auto p-4 text-xs font-mono leading-relaxed sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
};

/* Block Splitting Utility for Mintlify MDX */
interface BlockData {
  type: string;
  content: string;
  props: Record<string, string>;
}

function splitIntoBlocks(text: string): BlockData[] {
  const blocks: BlockData[] = [];
  let remaining = text;

  const componentTags = [
    'Tip',
    'Info',
    'Warning',
    'Note',
    'Card',
    'Steps',
    'Tabs',
    'Accordion',
    'ParamField',
    'ResponseField',
  ];

  // Regex to match code blocks or component tags
  while (remaining.length > 0) {
    // 1. Code Block ```lang ... ```
    const codeMatch = remaining.match(/^```(\w+)?\r?\n([\s\S]*?)```/);
    if (codeMatch) {
      blocks.push({
        type: 'code',
        content: codeMatch[2],
        props: { language: codeMatch[1] || 'bash' },
      });
      remaining = remaining.slice(codeMatch[0].length).trimStart();
      continue;
    }

    // 2. Component Tags
    let foundComponent = false;
    for (const tag of componentTags) {
      // Regex for `<Tag ...>...</Tag>`
      const pattern = new RegExp(`^<${tag}([^>]*)>([\\s\\S]*?)<\\/${tag}>`);
      const compMatch = remaining.match(pattern);
      if (compMatch) {
        const rawProps = compMatch[1];
        const innerContent = compMatch[2].trim();
        const props: Record<string, string> = {};

        // Parse attributes
        const attrRegex = /([\w\-]+)(?:=["']([^"']*)["'])?/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(rawProps)) !== null) {
          props[attrMatch[1]] = attrMatch[2] ?? 'true';
        }

        blocks.push({
          type: tag.toLowerCase(),
          content: innerContent,
          props,
        });

        remaining = remaining.slice(compMatch[0].length).trimStart();
        foundComponent = true;
        break;
      }
    }

    if (foundComponent) continue;

    // 3. Regular Markdown chunk until next codeblock or component tag
    const nextCode = remaining.search(/```/);
    let nextComp = -1;
    for (const tag of componentTags) {
      const idx = remaining.search(new RegExp(`<${tag}[^>]*>`));
      if (idx !== -1 && (nextComp === -1 || idx < nextComp)) {
        nextComp = idx;
      }
    }

    let cutIdx = -1;
    if (nextCode !== -1 && nextComp !== -1) {
      cutIdx = Math.min(nextCode, nextComp);
    } else if (nextCode !== -1) {
      cutIdx = nextCode;
    } else if (nextComp !== -1) {
      cutIdx = nextComp;
    }

    if (cutIdx === -1) {
      blocks.push({
        type: 'markdown',
        content: remaining,
        props: {},
      });
      break;
    } else if (cutIdx === 0) {
      // Just step forward 1 char
      remaining = remaining.slice(1);
    } else {
      blocks.push({
        type: 'markdown',
        content: remaining.slice(0, cutIdx),
        props: {},
      });
      remaining = remaining.slice(cutIdx);
    }
  }

  return blocks;
}
