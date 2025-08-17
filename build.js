import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';
import { format } from 'date-fns';

const POSTS_DIR = './posts';
const BLOG_DIR = './blog';
const LAYOUTS_DIR = './_layouts';

// Ensure blog directory exists
async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Read template file
async function readTemplate(templateName) {
  try {
    const templatePath = path.join(LAYOUTS_DIR, `${templateName}.html`);
    return await fs.readFile(templatePath, 'utf-8');
  } catch (error) {
    console.warn(`Template ${templateName} not found, using default layout`);
    return getDefaultTemplate();
  }
}

// Default blog post template
function getDefaultTemplate() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}} - Family Flow Blog</title>
  <meta name="description" content="{{excerpt}}">
  
  <!-- SEO Meta Tags -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="{{title}}">
  <meta property="og:description" content="{{excerpt}}">
  <meta property="og:url" content="https://familyflow.vercel.app/blog/{{slug}}">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="../images/app_icon.png">
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playwrite+AU+QLD:wght@100..400&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="../assets/css/blog.css">
</head>
<body>
  <header class="blog-header">
    <nav class="nav container">
      <a href="../index.html" class="logo">Family Flow</a>
      <ul class="nav-links">
        <li><a href="../index.html">Home</a></li>
        <li><a href="../blog/">Blog</a></li>
        <li><a href="../index.html#philosophy">Philosophy</a></li>
        <li><a href="../index.html#features">Features</a></li>
        <li><a href="../index.html#download">Start Now</a></li>
      </ul>
    </nav>
  </header>

  <main class="blog-post">
    <div class="container">
      <article>
        <header class="post-header">
          <h1>{{title}}</h1>
          <div class="post-meta">
            <time datetime="{{date}}">{{formattedDate}}</time>
            {{#author}}<span class="author">by {{author}}</span>{{/author}}
            {{#readTime}}<span class="read-time">{{readTime}} min read</span>{{/readTime}}
          </div>
        </header>
        
        {{#featured_image}}
        <div class="post-featured-image">
          <img src="{{featured_image}}" alt="{{title}}" />
        </div>
        {{/featured_image}}
        
        <div class="post-content">
          {{content}}
        </div>
        
        <footer class="post-footer">
          <a href="../blog/" class="back-to-blog">← Back to Blog</a>
        </footer>
      </article>
    </div>
  </main>

  <footer class="blog-footer">
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} Family Flow. Building connections that last beyond any app.</p>
    </div>
  </footer>
</body>
</html>`;
}

// Default blog index template
function getBlogIndexTemplate() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog - Family Flow</title>
  <meta name="description" content="Insights on family connection, digital wellness, and building lasting relationships beyond technology">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="../images/app_icon.png">
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playwrite+AU+QLD:wght@100..400&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="../assets/css/blog.css">
</head>
<body>
  <header class="blog-header">
    <nav class="nav container">
      <a href="../index.html" class="logo">Family Flow</a>
      <ul class="nav-links">
        <li><a href="../index.html">Home</a></li>
        <li><a href="../blog/" class="active">Blog</a></li>
        <li><a href="../index.html#philosophy">Philosophy</a></li>
        <li><a href="../index.html#features">Features</a></li>
        <li><a href="../index.html#download">Start Now</a></li>
      </ul>
    </nav>
  </header>

  <main class="blog-index">
    <div class="container">
      <div class="posts-grid">
        {{posts}}
      </div>
    </div>
  </main>

  <footer class="blog-footer">
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} Family Flow. Building connections that last beyond any app.</p>
    </div>
  </footer>
</body>
</html>`;
}

// Simple template engine for basic substitution
function renderTemplate(template, data) {
  let result = template;
  
  // Handle conditional blocks like {{#author}}content{{/author}} - must be done first
  result = result.replace(/{{#(\w+)}}(.*?){{\/\1}}/gs, (match, key, content) => {
    if (data[key]) {
      // Replace variables within the conditional block
      let processedContent = content;
      Object.keys(data).forEach(dataKey => {
        const regex = new RegExp(`{{${dataKey}}}`, 'g');
        processedContent = processedContent.replace(regex, data[dataKey] || '');
      });
      return processedContent;
    }
    return '';
  });
  
  // Replace simple variables like {{title}}
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, data[key] || '');
  });
  
  return result;
}

// Calculate reading time (rough estimate)
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

// Process a single blog post
async function processPost(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data: frontMatter, content } = matter(fileContent);
    
    // Generate slug from filename or title
    const filename = path.basename(filePath, '.md');
    const slug = frontMatter.slug || createSlug(frontMatter.title || filename);
    
    // Process markdown content
    const htmlContent = marked(content);
    const readTime = calculateReadTime(content);
    
    // Prepare template data
    const templateData = {
      title: frontMatter.title || 'Untitled',
      content: htmlContent,
      excerpt: frontMatter.excerpt || content.substring(0, 160) + '...',
      date: frontMatter.date || new Date().toISOString(),
      formattedDate: format(new Date(frontMatter.date || new Date()), 'MMMM d, yyyy'),
      author: frontMatter.author,
      readTime: readTime,
      slug: slug,
      featured_image: frontMatter.featured_image
    };
    
    // Get template and render
    const template = await readTemplate('post');
    const html = renderTemplate(template, templateData);
    
    // Write HTML file
    const outputPath = path.join(BLOG_DIR, `${slug}.html`);
    await fs.writeFile(outputPath, html);
    
    console.log(`✓ Generated: ${outputPath}`);
    
    return {
      ...templateData,
      slug,
      url: `/blog/${slug}.html`
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

// Generate RSS feed
async function generateRSSFeed(posts) {
  const sortedPosts = posts
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
    
  const rssItems = sortedPosts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>https://familyflow.vercel.app/blog/${post.slug}.html</link>
      <guid>https://familyflow.vercel.app/blog/${post.slug}.html</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>
  `).join('');
  
  const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Family Flow Blog</title>
    <description>Insights on family connection, digital wellness, and building lasting relationships beyond technology</description>
    <link>https://familyflow.vercel.app/blog/</link>
    <atom:link href="https://familyflow.vercel.app/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Family Flow Static Site Generator</generator>
    ${rssItems}
  </channel>
</rss>`;
  
  const rssPath = path.join(BLOG_DIR, 'rss.xml');
  await fs.writeFile(rssPath, rssContent);
  
  console.log(`✓ Generated: ${rssPath}`);
}

// Generate blog index page
async function generateBlogIndex(posts) {
  const sortedPosts = posts
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
    
  const postsHtml = sortedPosts.map(post => `
    <article class="post-card">
      ${post.featured_image ? `<div class="post-card-image">
        <img src="${post.featured_image}" alt="${post.title}" />
      </div>` : ''}
      <div class="post-card-content">
        <h2><a href="${post.slug}.html">${post.title}</a></h2>
        <div class="post-meta">
          <time datetime="${post.date}">${post.formattedDate}</time>
          ${post.author ? `<span class="author">by ${post.author}</span>` : ''}
          <span class="read-time">${post.readTime} min read</span>
        </div>
        <p class="post-excerpt">${post.excerpt}</p>
        <a href="${post.slug}.html" class="read-more">Read more →</a>
      </div>
    </article>
  `).join('');
  
  const template = getBlogIndexTemplate();
  const html = renderTemplate(template, { posts: postsHtml });
  
  const indexPath = path.join(BLOG_DIR, 'index.html');
  await fs.writeFile(indexPath, html);
  
  console.log(`✓ Generated: ${indexPath}`);
}

// Main build function
async function build() {
  console.log('🚀 Building Family Flow Blog...\n');
  
  // Ensure directories exist
  await ensureDir(BLOG_DIR);
  await ensureDir(LAYOUTS_DIR);
  
  try {
    // Read all markdown files from posts directory
    const files = await fs.readdir(POSTS_DIR);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    if (markdownFiles.length === 0) {
      console.log('No markdown files found in posts directory');
      // Still generate empty blog index
      await generateBlogIndex([]);
      return;
    }
    
    // Process all posts
    const posts = await Promise.all(
      markdownFiles.map(file => processPost(path.join(POSTS_DIR, file)))
    );
    
    // Generate blog index and RSS feed
    await generateBlogIndex(posts);
    await generateRSSFeed(posts);
    
    console.log(`\n✅ Build complete! Generated ${posts.filter(Boolean).length} blog posts`);
    console.log(`📝 Blog available at: ./blog/index.html`);
    console.log(`🔗 RSS feed available at: ./blog/rss.xml`);
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Posts directory not found, creating empty blog structure...');
      await ensureDir(POSTS_DIR);
      await generateBlogIndex([]);
      await generateRSSFeed([]);
    } else {
      console.error('Build failed:', error.message);
      process.exit(1);
    }
  }
}

// Run build
build().catch(console.error);