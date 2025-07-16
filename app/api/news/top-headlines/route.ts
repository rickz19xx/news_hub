import { type NextRequest, NextResponse } from "next/server"
import { fetchTopHeadlines } from "@/domain/news"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "general"
  const country = searchParams.get("country") || "us"
  const pageSize = Number(searchParams.get("pageSize") || 20)

  const apiKey = process.env.NEWS_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "NEWS_API_KEY environment variable is not set. Please add your NewsAPI key to your environment variables.",
      },
      { status: 500 },
    )
  }

  try {
    const data = await fetchTopHeadlines({ category, country, pageSize, apiKey })

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
        message: "Failed to fetch news articles",
      },
      { status: 500 },
    )
  }
}
