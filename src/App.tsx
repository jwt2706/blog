import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export type Post = {
  slug: string
  title: string
  date: string
  content: string // raw Markdown
}

// Vite glob to load all markdown files from the project root /posts/*.md
const modules = import.meta.glob('/posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const posts: Post[] = Object.entries(modules).map(([path, raw]) => {
  const slug = path.split('/').pop()!.replace(/\.md$/, '')
  return {
    slug,
    title: slug,      // no frontmatter => fallback to slug
    date: '',         // or derive from filesystem/use git metadata
    content: String(raw),
  }
}).sort((a, b) => b.slug.localeCompare(a.slug))

export default function App() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">jthome's blog</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug}>
            <h2>{post.title}</h2>
            <p className="text-sm text-gray-500">{post.date}</p>

            <div className="prose lg:prose-lg dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}