/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllPostSlugs, getPostData } from '@/lib/posts'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = getAllPostSlugs()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Post({ params }: { params: any }) {
  const awaitedParams = await params;
  const postData = await getPostData(awaitedParams.slug)

  if (!postData) {
    notFound()
  }

  return (
    <article className="max-w-2xl mx-auto p-4 mt-8">
      <h1 className="text-3xl font-bold mb-4 text-center">{postData.title}</h1>
      <div className="text-gray-500 text-center mb-8">
        {postData.date}
      </div>
      <div
        className="prose lg:prose-xl mx-auto"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
    </article>
  )
}
