import type { InferGetStaticPropsType, GetStaticProps } from 'next'
import fs from 'fs'
import fm from 'front-matter'
import { remark } from 'remark'

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
  const file = fs.readFileSync('public/__posts/example.md', {
    encoding: 'utf8',
  })
  const { attributes: metadata, body } = fm<Metadata>(file)
  const blog = await remark().process(body)
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
  return
}

// export async function getStaticPaths() {
//   return {
//     paths: ['blog/example'],
//     fallback: true,
//   }
// }
