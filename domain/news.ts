// Entitas
export interface Article {
  source: { id: string | null; name: string }
  author: string | null
  title: string
  description: string
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

export interface NewsApiResponse {
  status: string
  totalResults: number
  articles: Article[]
  message?: string
}

// Use case: fetch top headlines
export async function fetchTopHeadlines({ category = "general", country = "us", pageSize = 20, apiKey }: {
  category?: string
  country?: string
  pageSize?: number
  apiKey: string
}): Promise<NewsApiResponse> {
  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&pageSize=${pageSize}&apiKey=${apiKey}`,
    { headers: { "User-Agent": "NewsApp/1.0" } }
  )
  return response.json()
}

// Use case: search news
export async function searchNews({ query, pageSize = 20, sortBy = "publishedAt", apiKey }: {
  query: string
  pageSize?: number
  sortBy?: string
  apiKey: string
}): Promise<NewsApiResponse> {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&sortBy=${sortBy}&apiKey=${apiKey}`,
    { headers: { "User-Agent": "NewsApp/1.0" } }
  )
  return response.json()
}

// Use case: fetch article by title
export async function fetchArticleByTitle({ title, apiKey }: {
  title: string
  apiKey: string
}): Promise<Article | null> {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(title)}&pageSize=10&sortBy=relevancy&apiKey=${apiKey}`,
    { headers: { "User-Agent": "NewsApp/1.0" } }
  )
  const data: NewsApiResponse = await response.json()
  return data.articles.find(
    (article) => article.title === title || article.title.toLowerCase().includes(title.toLowerCase())
  ) || null
}

// Use case: fetch article by url
export async function fetchArticleByUrl({ url, apiKey }: {
  url: string
  apiKey: string
}): Promise<Article | null> {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(url)}&pageSize=10&sortBy=publishedAt&apiKey=${apiKey}`,
    { headers: { "User-Agent": "NewsApp/1.0" } }
  )
  const data: NewsApiResponse = await response.json()
  return data.articles.find((article) => article.url === url) || null
} 