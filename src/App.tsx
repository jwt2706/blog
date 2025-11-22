import React from 'react'
import { posts } from './posts'

export default function App() {
  return (
    <div className="prose prose-slate max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">jthome's blog</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="prose lg:prose-lg">
            <h2>{post.title}</h2>
            <p className="text-sm text-gray-500">{post.date}</p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        ))}
      </div>
    </div>
  )
}