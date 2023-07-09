import type { InferGetStaticPropsType, GetStaticProps } from 'next'
import fs from 'fs'
import fm from 'front-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

type Metadata = {
  categories: string[]
  date: string
  description: string
  slug: string
  tags: string[]
  title: string
}

export const getStaticProps: GetStaticProps<{
  metadata: Metadata
  blog: string
}> = async () => {
  const file = fs.readFileSync('public/__posts/nextjs.md', {
    encoding: 'utf8',
  })
  const { attributes: metadata, body } = fm<Metadata>(file)
  const blog = await remark()
    .use(remarkHtml as any)
    .process(body)
  return {
    props: { metadata, blog: String(blog) },
  }
}

export default function Page({
  metadata,
  blog,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log(metadata)
  console.log(blog)
  return (
    <div>
      <h1>{metadata.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: blog }} />
    </div>
  )
}

// export async function getStaticPaths() {
//   return {
//     paths: ['blog/example'],
//     fallback: true,
//   }
// }
