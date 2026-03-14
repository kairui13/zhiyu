import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '情绪灯塔 - AI疗愈助手',
  description: '每天3分钟情绪对话，让情绪有出口，让改变有抓手',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}