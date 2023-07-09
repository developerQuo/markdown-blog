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
  metadata: Metadata | undefined
  blog: string | undefined
}> = async ({ params }) => {
  if (!params?.title || !Array.isArray(params?.title))
    return { props: { metadata: undefined, blog: undefined } }

  const title = params.title[0]
  const file = fs.readFileSync(`public/__posts/${title}.md`, {
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
  if (!metadata || !blog)
    return (
      <div>
        <h1>Page not found</h1>
        <p>존재하지 않는 페이지입니다.</p>
      </div>
    )

  return (
    <div>
      <h1>{metadata.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: blog }} />
    </div>
  )
}

export async function getStaticPaths() {
  const paths = fs
    .readdirSync('public/__posts')
    .map(file => '/blog/' + file.replace(/\.md$/, ''))
  return {
    paths,
    fallback: true,
  }
}
