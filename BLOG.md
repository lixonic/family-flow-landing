# Family Flow Blog System

This project now includes a Jekyll-like static blog generator that transforms your Family Flow landing page into a complete website + blog platform.

## Quick Start

1. **Write a blog post**: Create a markdown file in the `posts/` directory
2. **Build the blog**: Run `npm run build`
3. **View locally**: Run `npm start` and visit `http://localhost:3000/blog/`

## Writing Blog Posts

Create markdown files in the `posts/` directory with frontmatter:

```markdown
---
title: "Your Post Title"
date: "2024-01-15"
author: "Your Name"
excerpt: "A brief description of your post for previews and RSS feeds"
slug: "custom-url-slug" # Optional - auto-generated from title if not provided
---

# Your Post Content

Write your blog post content here using standard markdown.

## Subheadings work great

- Lists are supported
- **Bold** and *italic* text
- [Links](https://example.com)
- `code snippets`

> Blockquotes for important callouts

```code blocks are also supported```
```

## Directory Structure

```
├── posts/              # Your markdown blog posts
├── blog/               # Generated HTML blog pages (created by build)
├── assets/css/         # Blog styling
├── _layouts/           # Custom templates (optional)
├── build.js            # Static site generator
└── index.html          # Main landing page
```

## Build Commands

- `npm run build` - Generate blog from markdown files
- `npm run dev` - Build blog and serve locally
- `npm start` - Serve existing files locally

## Features

### ✅ What's Included

- **Markdown Processing**: Write in markdown, get beautiful HTML
- **Responsive Design**: Looks great on all devices
- **SEO Optimization**: Meta tags, Open Graph, structured data
- **RSS Feed**: Automatically generated at `/blog/rss.xml`
- **Fast Loading**: Optimized static files
- **Navigation**: Integrated with main landing page
- **Reading Time**: Automatically calculated
- **Clean URLs**: SEO-friendly post URLs

### 🎨 Customization

- **Templates**: Add custom templates in `_layouts/` directory
- **Styling**: Modify `assets/css/blog.css` for custom appearance
- **Layout**: Built-in responsive grid for post listings

## Development Workflow

1. **Create new post**: Add markdown file to `posts/`
2. **Preview locally**: Run `npm run dev`
3. **Deploy**: Commit changes - Vercel automatically builds and deploys

## Blog Features

### Automatic Features
- Post excerpts for listings
- Reading time calculation
- Responsive image handling
- Social media meta tags
- RSS feed generation
- Clean, SEO-friendly URLs

### Manual Content Features
- Custom post slugs
- Author attribution
- Publication dates
- Rich markdown support
- Code syntax highlighting

## Integration with Landing Page

The blog seamlessly integrates with your Family Flow landing page:

- **Navigation**: Blog link added to main navigation
- **Brand Consistency**: Uses same fonts, colors, and design language
- **Cross-linking**: Easy navigation between landing page and blog
- **Mobile Responsive**: Consistent experience across devices

## Deployment

The blog works with your existing Vercel deployment:

1. Push changes to your repository
2. Vercel automatically runs `npm run build`
3. Blog is live alongside your landing page

## Content Strategy

The blog is designed for Family Flow's unique "graduation platform" philosophy:

- **Educational Content**: Insights on family psychology and digital wellness
- **Real Stories**: Family experiences and case studies
- **Philosophy Deep-dives**: Exploring the anti-engagement approach
- **Science-backed**: Research-based parenting and connection advice

## RSS Feed

An RSS feed is automatically generated at `/blog/rss.xml` with:
- Full post content
- Publication dates
- Author information
- SEO-optimized descriptions

## Performance

The static generation ensures:
- **Fast Loading**: No server-side processing
- **SEO Friendly**: Pre-rendered HTML for search engines
- **Cacheable**: Static files for optimal performance
- **Reliable**: No database dependencies

## Maintenance

- **Add posts**: Simply add markdown files to `posts/`
- **Update styling**: Modify CSS files as needed
- **Template changes**: Update templates in `_layouts/`
- **Rebuild**: Run `npm run build` after changes

This blog system gives you the simplicity of Jekyll with the flexibility of custom development, perfectly suited for Family Flow's thoughtful approach to family technology.