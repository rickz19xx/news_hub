import React from "react"
import type { Metadata } from "next"
import { ConfigProvider } from "antd"
import "./globals.css"

export const metadata: Metadata = {
  title: "News Hub - Stay Updated",
  description: "Stay updated with the latest news from around the world",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1890ff",
              borderRadius: 8,
            },
          }}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  )
}
