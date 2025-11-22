import { useEffect, useState } from 'react'
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
  // derive a title from the first H1 (# ...) line if present
  const titleMatch = String(raw).match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : slug
  return {
    slug,
    title,
    date: '',
    content: String(raw),
  }
}).sort((a, b) => b.slug.localeCompare(a.slug))

function getSlugFromHash(hash: string) {
  // expect "#/post/<slug>" or "#/post/<slug>?..." or "#/post/<slug>/"
  const m = hash.match(/^#\/post\/([^/?#]+)/)
  return m ? decodeURIComponent(m[1]) : null
}

export default function App() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(() => getSlugFromHash(location.hash))

  useEffect(() => {
    const onHash = () => setSelectedSlug(getSlugFromHash(location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const openPost = (slug: string | null) => {
    if (!slug) {
      history.pushState(null, '', '#/')
      setSelectedSlug(null)
    } else {
      history.pushState(null, '', `#/post/${encodeURIComponent(slug)}`)
      setSelectedSlug(slug)
    }
  }

  const selectedPost = selectedSlug ? posts.find((p) => p.slug === selectedSlug) ?? null : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sticky top-4">
            <h1 className="text-xl font-bold mb-4">jt's blog</h1>
            <nav className="space-y-2">
              <button
                onClick={() => openPost(null)}
                className={`w-full text-left px-2 py-1 rounded ${selectedSlug === null ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                Home
              </button>
              <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                {posts.map((post) => (
                  <a
                    key={post.slug}
                    href={`#/post/${encodeURIComponent(post.slug)}`}
                    className={`block px-2 py-2 rounded ${selectedSlug === post.slug ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    onClick={(e) => {
                      e.preventDefault()
                      openPost(post.slug)
                    }}
                  >
                    <div className="text-sm font-medium">{post.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{post.date || post.slug}</div>
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </aside>

        <main className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            {!selectedPost ? (
              <div>
                <h2 className="text-2xl font-semibold mb-2">Welcome</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  This is the homepage. Select an article from the sidebar to read.
                </p>

                <h3 className="text-lg font-medium mb-2">Latest posts</h3>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <article key={post.slug} className="border rounded p-3 hover:shadow-sm">
                      <a
                        href={`#/post/${encodeURIComponent(post.slug)}`}
                        onClick={(e) => {
                          e.preventDefault()
                          openPost(post.slug)
                        }}
                        className="block"
                      >
                        <h4 className="font-semibold">{post.title}</h4>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{post.date || post.slug}</div>
                        <div className="mt-2 prose dark:prose-invert text-sm line-clamp-3">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content}
                          </ReactMarkdown>
                        </div>
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <article>
                <header className="mb-4">
                  <button
                    onClick={() => openPost(null)}
                    className="text-sm text-blue-600 dark:text-blue-400 underline mb-2"
                  >
                    ← Back
                  </button>
                  <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedPost.date || selectedPost.slug}</p>
                </header>

                <div className="prose lg:prose-lg dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedPost.content}
                  </ReactMarkdown>
                </div>
              </article>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
// ...existing code...