"use client";

import React from 'react';

import { useState, useEffect } from "react"
import { Card, Row, Col, Typography, Spin, Alert, Input, Select, Button } from "antd"
import { SearchOutlined, CalendarOutlined, UserOutlined } from "@ant-design/icons"
import Link from "next/link"
import type { Article, NewsApiResponse } from "@/types/news"

const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("general")

  const categories = ["general", "business", "entertainment", "health", "science", "sports", "technology"]

  const fetchArticles = async (query?: string) => {
    try {
      setLoading(true)
      setError(null)

      const endpoint = query
        ? `/api/news/search?q=${encodeURIComponent(query)}`
        : `/api/news/top-headlines?category=${category}`

      const response = await fetch(endpoint)
      const data: NewsApiResponse = await response.json()

      if (data.status === "ok") {
        setArticles(data.articles)
      } else {
        setError(data.message || "Failed to fetch articles")
      }
    } catch (err) {
      setError("Failed to fetch articles. Please check your API key configuration.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [category])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    if (value.trim()) {
      fetchArticles(value)
    } else {
      fetchArticles()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + "..."
  }

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: "24px" }} />
        <Button onClick={() => fetchArticles()}>Retry</Button>
      </div>
    )
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <Title level={1} style={{ color: "#1890ff", marginBottom: "8px" }}>
          📰 News Hub
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Stay updated with the latest news from around the world
        </Text>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search news..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={category}
              onChange={setCategory}
              size="large"
              style={{ width: "100%" }}
              disabled={!!searchQuery}
            >
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "48px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>
            <Text>Loading latest news...</Text>
          </div>
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {articles.map((article, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Link
                href={{ pathname: `/article/${encodeURIComponent(article.url)}` }}
                style={{ textDecoration: "none" }}
                // @ts-ignore: next/link sudah support state di runtime
                state={article}
                onClick={() => {
                  try {
                    localStorage.setItem("lastArticle", JSON.stringify(article));
                  } catch (e) {}
                }}
              >
                <Card
                  hoverable
                  cover={
                    article.urlToImage ? (
                      <div style={{ height: "200px", overflow: "hidden" }}>
                        <img
                          alt={article.title}
                          src={article.urlToImage || "/placeholder.svg"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)"
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = "scale(1)"
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          height: "200px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "48px",
                        }}
                      >
                        📰
                      </div>
                    )
                  }
                  style={{ height: "100%" }}
                  bodyStyle={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    height: "calc(100% - 200px)",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Title
                      level={4}
                      style={{
                        marginBottom: "8px",
                        lineHeight: "1.3",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {article.title}
                    </Title>

                    <Text
                      type="secondary"
                      style={{
                        marginBottom: "12px",
                        lineHeight: "1.4",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {article.description || "No description available"}
                    </Text>
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid #f0f0f0",
                      paddingTop: "12px",
                      marginTop: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "12px",
                      }}
                    >
                      <Text
                        type="secondary"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flex: 1,
                          marginRight: "8px",
                        }}
                      >
                        <UserOutlined style={{ marginRight: "4px" }} />
                        {truncateText(article.source.name, 20)}
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <CalendarOutlined style={{ marginRight: "4px" }} />
                        {formatDate(article.publishedAt)}
                      </Text>
                    </div>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}

      {!loading && articles.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>📰</div>
          <Title level={3} type="secondary">
            No articles found
          </Title>
          <Text type="secondary">Try adjusting your search criteria or check back later.</Text>
        </div>
      )}
    </div>
  )
}
