export interface Category {
  id: string
  name: string
}

export interface Genre {
  id: string
  name: string
}

export interface Manga {
  id: string
  title: string
  description: string
  price: number
  stock: number
  cover_url: string
  image_url?: string
  category: Category
  manga_genres: Array<{
    genre: Genre
  }>
  author?: string
  publisher?: string
  release_date?: string
  rating?: number
  average_rating?: number
  slug: string
  format?: string
  pages?: number
  language?: string
  isbn?: string
}
