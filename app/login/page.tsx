'use client'
import { useEffect } from 'react'

export default function LoginPage() {
  useEffect(() => {
    window.location.href = '/api/auth/login'
  }, [])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-10">
      <p className="text-lg">Redirecting to TikTok for authentication...</p>
    </main>
  )
}
