import type { InferGetStaticPropsType, GetStaticProps } from 'next'
import fs from 'fs'
import fm from 'front-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { Content, Metadata } from 'types/blog'
import { BLOG_DIR } from 'common/constants'

export const getStaticProps: GetStaticProps<{
  metadata: Metadata | undefined
  content: Content | undefined
}> = async ({ params }) => {
  if (!params?.slug || !Array.isArray(params?.slug))
    return { props: { metadata: undefined, content: undefined } }

  const slug = params.slug[0]
  const file = fs.readFileSync(`${BLOG_DIR}/${slug}.md`, {
    encoding: 'utf8',
  })
  const { attributes: metadata, body } = fm<Metadata>(file)
  const content = String(
    await remark()
      .use(remarkHtml as any)
      .process(body),
  )
  return {
    props: { metadata, content },
  }
}

export default function Page({
  metadata,
  content,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!metadata || !content)
    return (
      <div>
        <h1>Page not found</h1>
        <p>존재하지 않는 페이지입니다.</p>
      </div>
    )

  return (
    <div>
      <h1>{metadata.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}

export async function getStaticPaths() {
  const paths = fs
    .readdirSync(BLOG_DIR)
    .map(file => '/blog/' + file.replace(/\.md$/, ''))
  return {
    paths,
    fallback: true,
  }
}
