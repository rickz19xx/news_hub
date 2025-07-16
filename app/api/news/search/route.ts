import { type NextRequest, NextResponse } from "next/server"
import { searchNews } from "@/domain/news"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const pageSize = Number(searchParams.get("pageSize") || 20)
  const sortBy = searchParams.get("sortBy") || "publishedAt"

  if (!query) {
    return NextResponse.json({ status: "error", message: "Search query is required" }, { status: 400 })
  }

  const apiKey = process.env.NEWS_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      {
        status: "error",
        message: "NEWS_API_KEY environment variable is not set",
      },
      { status: 500 },
    )
  }

  try {
    const data = await searchNews({ query, pageSize, sortBy, apiKey })

    const filteredArticles = data.articles.filter(
      (article) =>
        article.title && article.title !== "[Removed]" && article.description && article.description !== "[Removed]",
    )

    return NextResponse.json({
      ...data,
      articles: filteredArticles,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to search news articles",
      },
      { status: 500 },
    )
  }
}
