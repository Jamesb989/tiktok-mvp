'use client'
import { useEffect } from 'react'

export default function LoginPage() {
  useEffect(() => {
    window.location.href = '/api/auth/login'
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold mb-4">Redirecting to TikTok login...</h1>
      <p className="text-gray-600">
        If you&apos;re not redirected, <a href="/api/auth/login" className="underline text-blue-600">click here</a>.
      </p>
    </main>
  )
}
