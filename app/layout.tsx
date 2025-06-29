// app/layout.tsx
import '../styles/globals.css'

export const metadata = {
  title: 'Nudge Factor',
  description: 'TikTok MVP',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

