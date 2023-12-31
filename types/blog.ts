export type Metadata = {
  categories: string[]
  date: string
  description: string
  slug: string
  tags: string[]
  title: string
}

export type BlogList = Pick<Metadata, 'date' | 'description' | 'title' | 'slug'>

export type Content = string
