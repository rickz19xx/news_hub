"use client"

import React from 'react';
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, Typography, Button, Spin, Alert, Tag, Divider } from "antd"
import { ArrowLeftOutlined, CalendarOutlined, UserOutlined, LinkOutlined, ShareAltOutlined } from "@ant-design/icons"
import type { Article } from "@/types/news"

const { Title, Paragraph, Text } = Typography

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // @ts-ignore: next/router state
    if (window.history.state && window.history.state.state) {
      setArticle(window.history.state.state as Article);
      setLoading(false);
      return;
    }
    try {
      const last = localStorage.getItem("lastArticle");
      if (last) {
        setArticle(JSON.parse(last));
        setLoading(false);
        return;
      }
    } catch (e) {}
    const fetchArticle = async () => {
      try {
        setLoading(true)
        setError(null)
        const url = decodeURIComponent(params.url as string)
        const response = await fetch(`/api/news/article?url=${encodeURIComponent(url)}`)
        const data = await response.json()
        if (data.article) {
          setArticle(data.article)
        } else {
          setError("Article not found")
        }
      } catch (err) {
        setError("Failed to fetch article details")
      } finally {
        setLoading(false)
      }
    }
    if (params.url) {
      fetchArticle()
    }
  }, [params.url])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description || "",
          url: window.location.href,
        })
      } catch (err) {
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          flexDirection: "column",
        }}
      >
        <Spin size="large" />
        <Text style={{ marginTop: "16px" }}>Loading article...</Text>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
        <Alert
          message="Error"
          description={error || "Article not found"}
          type="error"
          showIcon
          style={{ marginBottom: "24px" }}
        />
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()} style={{ marginBottom: "16px" }}>
          Back to News
        </Button>
      </div>

      <Card style={{ marginBottom: "24px" }}>
        {article.urlToImage && (
          <div
            style={{
              marginBottom: "24px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={article.urlToImage || "/placeholder.svg"}
              alt={article.title}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "400px",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <Tag color="blue" style={{ marginBottom: "8px" }}>
            {article.source.name}
          </Tag>
        </div>

        <Title
          level={1}
          style={{
            marginBottom: "16px",
            lineHeight: "1.2",
            color: "#262626",
          }}
        >
          {article.title}
        </Title>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <Text type="secondary" style={{ display: "flex", alignItems: "center" }}>
            <CalendarOutlined style={{ marginRight: "6px" }} />
            {formatDate(article.publishedAt)}
          </Text>

          {article.author && (
            <Text type="secondary" style={{ display: "flex", alignItems: "center" }}>
              <UserOutlined style={{ marginRight: "6px" }} />
              {article.author}
            </Text>
          )}

          <Button icon={<ShareAltOutlined />} onClick={handleShare} type="text" size="small">
            Share
          </Button>
        </div>

        <Divider />

        {article.description && (
          <Paragraph
            style={{
              fontSize: "18px",
              lineHeight: "1.6",
              color: "#595959",
              fontStyle: "italic",
              marginBottom: "24px",
              padding: "16px",
              background: "#fafafa",
              borderLeft: "4px solid #1890ff",
              borderRadius: "4px",
            }}
          >
            {article.description}
          </Paragraph>
        )}

        {article.content && (
          <div>
            <Paragraph
              style={{
                fontSize: "16px",
                lineHeight: "1.8",
                color: "#262626",
                marginBottom: "24px",
              }}
            >
              {article.content.replace(/\[\+\d+ chars\]$/, "")}
            </Paragraph>
          </div>
        )}

        <Divider />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <Text type="secondary">
            Source: <strong>{article.source.name}</strong>
          </Text>

          {article.url && (
            <Button type="primary" icon={<LinkOutlined />} href={article.url} target="_blank" rel="noopener noreferrer">
              Read Full Article
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
