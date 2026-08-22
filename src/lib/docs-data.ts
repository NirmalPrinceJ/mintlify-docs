import { DocsConfig, DocPage } from '../types';

export const initialDocsConfig: DocsConfig = {
  $schema: "https://mintlify.com/docs.json",
  theme: "mint",
  name: "Mintlify Starter Kit",
  colors: {
    primary: "#16A34A",
    light: "#07C983",
    dark: "#15803D"
  },
  favicon: "/favicon.svg",
  navigation: {
    pages: [
      {
        group: "Getting Started",
        pages: [
          "index",
          "quickstart"
        ]
      },
      {
        group: "Components & Features",
        pages: [
          "components",
          "api-reference"
        ]
      }
    ],
    global: {
      anchors: [
        {
          anchor: "Documentation",
          href: "https://mintlify.com/docs",
          icon: "book-open"
        },
        {
          anchor: "Blog",
          href: "https://mintlify.com/blog",
          icon: "newspaper"
        }
      ]
    }
  },
  logo: {
    light: "/logo/light.svg",
    dark: "/logo/dark.svg"
  },
  navbar: {
    links: [
      {
        label: "Support",
        href: "mailto:hi@mintlify.com"
      }
    ],
    primary: {
      type: "button",
      label: "Dashboard",
      href: "https://app.mintlify.com"
    }
  },
  contextual: {
    options: [
      "copy",
      "view",
      "chatgpt",
      "claude",
      "perplexity",
      "mcp",
      "cursor",
      "vscode"
    ]
  },
  footer: {
    socials: {
      x: "https://x.com/mintlify",
      github: "https://github.com/mintlify",
      linkedin: "https://linkedin.com/company/mintlify"
    }
  }
};

export const initialDocPages: Record<string, DocPage> = {
  index: {
    id: "index",
    title: "Introduction",
    description: "Welcome to your project",
    group: "Getting Started",
    content: `---
title: "Introduction"
description: "Welcome to your project"
---

Write a short description of your product here. What it does, who it's for, and what they can accomplish with it.

<Tip>
  Ready to make this your own? Start by editing this page. Update your \`docs.json\` file to customize your site. Then fill out the [Quickstart](/quickstart) page.
</Tip>

<Card title="Quickstart" icon="rocket" href="/quickstart">
  This card links to the quickstart page in your project.
</Card>
<Card title="Components" icon="puzzle-piece" href="/components">
  Add cards, callouts, steps, tabs, and more to design and structure your pages.
</Card>
<Card title="Settings" icon="gear" href="https://mintlify.com/docs/organize/settings">
  Set your site name, branding, and navigation in the \`docs.json\` file.
</Card>
`
  },
  quickstart: {
    id: "quickstart",
    title: "Quickstart",
    description: "Begin with a guide on the fastest path to a successful outcome",
    group: "Getting Started",
    content: `---
title: "Quickstart"
description: "Begin with a guide on the fastest path to a successful outcome"
---

Describe how someone begins using your product. What is the first thing they need to do? Are there any prerequisites?

A quickstart should take someone from zero to using your product. They'll get a quick win and a sense of what they can accomplish.

## Prerequisites

Before you begin, you must have:

- Requirement one (for example, Node.js 18+, a free account, an API key)
- Requirement two (for example, a compatible device, a compatible browser, a compatible operating system)

## Get started

<Steps>
  <Step title="Install">
    Describe how to install your product or sign up.

    \`\`\`bash
    npm install your-package
    \`\`\`
  </Step>
  <Step title="Configure">
    Describe any setup or configuration needed before first use.

    \`\`\`bash
    your-cli init
    \`\`\`
  </Step>
  <Step title="Run it">
    Show the first thing a user does to see it working.

    \`\`\`bash
    your-cli start
    \`\`\`
  </Step>
</Steps>

<Tip>
  Give people a way to get help. This could be a link to a support page, a chat with a customer support agent, or a forum for your product.

  Example: Need help? Reach out to us at [support@yourcompany.com](mailto:support@yourcompany.com).
</Tip>
`
  },
  components: {
    id: "components",
    title: "Components Reference",
    description: "Interactive examples of built-in Mintlify MDX components",
    group: "Components & Features",
    content: `---
title: "Components Reference"
description: "Interactive examples of built-in Mintlify MDX components"
---

Mintlify comes packed with interactive MDX components to make documentation engaging, organized, and beautiful.

## Callouts & Alerts

Use callouts to highlight important information, tips, warnings, or notes.

<Tip>
  This is a **Tip** callout. Use it to suggest best practices or helpful tips!
</Tip>

<Info>
  This is an **Info** callout. Use it to share contextual details or additional background.
</Info>

<Warning>
  This is a **Warning** callout. Use it to alert users about breaking changes or potential pitfalls.
</Warning>

<Note>
  This is a **Note** callout. Perfect for subtle remarks or supplementary details.
</Note>

## Interactive Tabs

Organize related content or multiple language snippets into clean tabbed panels.

<Tabs>
  <Tab title="cURL">
    \`\`\`bash
    curl -X POST https://api.example.com/v1/auth \\
      -H "Authorization: Bearer YOUR_API_KEY" \\
      -d '{"client_id": "abc_123"}'
    \`\`\`
  </Tab>
  <Tab title="JavaScript">
    \`\`\`javascript
    import { Client } from '@example/sdk';

    const client = new Client({ apiKey: process.env.API_KEY });
    const response = await client.auth.verify();
    \`\`\`
  </Tab>
  <Tab title="Python">
    \`\`\`python
    from example import Client

    client = Client(api_key="your_api_key")
    response = client.auth.verify()
    \`\`\`
  </Tab>
</Tabs>

## Accordions & FAQs

Collapsible disclosure blocks keep long reference sections tidy.

<Accordion title="How do I deploy my docs to production?">
  Changes pushed to your GitHub default branch automatically trigger a deployment via the Mintlify GitHub integration.
</Accordion>

<Accordion title="Can I customize theme colors and typography?">
  Yes! In your \`docs.json\` file, configure the \`colors\` object with \`primary\`, \`light\`, and \`dark\` hex codes.
</Accordion>

## Interactive Steps

Guide users step-by-step through complex workflows.

<Steps>
  <Step title="Create your project">
    Initialize a new repository using the template.
  </Step>
  <Step title="Edit docs.json">
    Configure your brand colors, navigation groups, and navbar links.
  </Step>
  <Step title="Write MDX files">
    Create \`.mdx\` pages with frontmatter and rich Mintlify components.
  </Step>
</Steps>
`
  },
  "api-reference": {
    id: "api-reference",
    title: "API Reference",
    description: "Explore endpoints, parameters, and response formats",
    group: "Components & Features",
    content: `---
title: "API Reference"
description: "Explore endpoints, parameters, and response formats"
---

Welcome to the API reference. All API endpoints require an API key passed in the \`Authorization\` header.

## Authentication

\`\`\`bash
Authorization: Bearer <your_token_here>
\`\`\`

## Endpoints

### Get Project Details

\`GET /v1/projects/:id\`

Retrieve configuration metadata for a specific project.

<ParamField path="id" type="string" required>
  The unique identifier of the project to retrieve.
</ParamField>

<ParamField query="include_drafts" type="boolean">
  Whether to include unpublished draft documents in the response.
</ParamField>

<ResponseField name="status" type="string">
  Indicates the health status of the project (\`active\` | \`suspended\`).
</ResponseField>

<ResponseField name="created_at" type="string">
  ISO-8601 timestamp representing creation date.
</ResponseField>

\`\`\`json
{
  "id": "proj_99214a",
  "name": "Acme Docs",
  "status": "active",
  "created_at": "2026-08-22T07:00:00Z"
}
\`\`\`
`
  }
};

export function parseFrontmatter(raw: string): { title: string; description?: string; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { title: 'Untitled Document', body: raw };
  }

  const frontmatterBlock = match[1];
  const body = match[2];

  let title = 'Untitled Document';
  let description: string | undefined;

  const titleMatch = frontmatterBlock.match(/title:\s*["']?([^"'\n\r]+)["']?/i);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  const descMatch = frontmatterBlock.match(/description:\s*["']?([^"'\n\r]+)["']?/i);
  if (descMatch) {
    description = descMatch[1].trim();
  }

  return { title, description, body };
}
