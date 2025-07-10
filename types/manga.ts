export interface Category {
  id: string
  name: string
}

export interface Genre {
  id: string
  name: string
}

export interface Review {
  id: string
  rating: number
  comment: string
  user_id: string
  created_at: string
  author?: string
  avatar?: string
  date?: string
}

export interface MangaSpecifications {
  format: string
  pages: number
  language: string
  isbn: string
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
  reviews: Review[]
  slug: string
  specifications: MangaSpecifications
  created_at?: string
  updated_at?: string
  releaseDate?: string // Alias pour release_date
}

export interface MangaListItem {
  id: string
  title: string
  author?: string
  price: number
  cover_url: string
  slug: string
  rating?: number
  stock: number
}
