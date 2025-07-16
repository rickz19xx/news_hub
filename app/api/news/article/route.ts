import { type NextRequest, NextResponse } from "next/server"
import { fetchArticleByUrl } from "@/domain/news"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ status: "error", message: "Article url is required" }, { status: 400 })
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
    const article = await fetchArticleByUrl({ url, apiKey })

    if (!article) {
      return NextResponse.json({ status: "error", message: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({ article })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch article details",
      },
      { status: 500 },
    )
  }
}
