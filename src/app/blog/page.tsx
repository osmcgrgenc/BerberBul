import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'

export default function BlogPage() {
  const allPostsData = getSortedPostsData()
  return (
    <section className="text-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Blog</h2>
      <ul className="list-none p-0">
        {allPostsData.map(({ slug, date, title }) => (
          <li className="mb-4 border p-4 rounded-lg shadow-sm" key={slug}>
            <Link href={`/blog/${slug}`} className="text-blue-600 hover:underline text-xl font-semibold">
              {title}
            </Link>
            <br />
            <small className="text-gray-500">
              {date}
            </small>
          </li>
        ))}
      </ul>
    </section>
  )
}
