# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js blog application (v2) that renders markdown posts. The blog uses Next.js App Router and is deployed on Vercel.

## Commands

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
```

## Architecture

### Core Dependencies
- **Next.js 14.2.15** - React framework with App Router
- **react-markdown 9.0.1** - Converts markdown to React components
- **gray-matter 4.0.3** - Parses YAML frontmatter from markdown files
- **rehype-highlight 7.0.0** - Adds syntax highlighting to code blocks

### Project Structure

The blog follows a file-based routing system with markdown posts:

- **`/posts/*.md`** - Markdown blog posts with YAML frontmatter (title, date, tags)
- **`/app/page.tsx`** - Homepage listing all posts sorted by date
- **`/app/posts/[slug]/page.tsx`** - Dynamic route for individual blog posts
- **`/lib/posts.tsx`** - Utility to read and parse markdown posts

### Key Patterns

1. **Static Generation**: Posts are statically generated at build time using `generateStaticParams()`
2. **Frontmatter Structure**: Each markdown post requires:
   ```yaml
   ---
   title: 'Post Title'
   date: 'YYYY-MM-DD'
   tags: ['tag1', 'tag2']
   ---
   ```
3. **Revalidation**: Individual post pages use `revalidate = 3600` for ISR (1 hour)
4. **TypeScript**: Project uses TypeScript with relaxed strict mode (`strict: false` in tsconfig)