import type { GetStaticProps, NextPage } from 'next'
import fs from 'fs'
import { BlogList, Metadata } from 'types/blog'
import fm from 'front-matter'
import Link from 'next/link'
import { BLOG_DIR } from 'common/constants'

type InputProps = { data: BlogList[] }

export const getStaticProps: GetStaticProps<InputProps> = async () => {
  const data = fs.readdirSync(BLOG_DIR).map(file => {
    const mdFile = fs.readFileSync(`${BLOG_DIR}/${file}`, {
      encoding: 'utf8',
    })
    const { attributes } = fm<Metadata>(mdFile)
    const { categories, tags, ...metadata } = attributes
    return metadata
  })

  return {
    props: { data },
  }
}

const Home: NextPage<InputProps> = ({ data }) => {
  return (
    <div className="">
      <h1>SSG Blog</h1>
      <ul className="list-none">
        {data.map(({ title, date, description, slug }) => (
          <li key={title}>
            <Link href={`/blog/${slug}`}>
              <div className="cursor-pointer">
                <h2>{title}</h2>
                <div>{description}</div>
                <div>{date}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
