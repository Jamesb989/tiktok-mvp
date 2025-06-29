'use client'
import { useEffect, useState } from 'react'

type Creator = {
  id: string
  nickname: string
  follower_count: number
}

export default function Dashboard() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/creators')
      .then(res => res.json())
      .then(data => {
        setCreators(data)
        setLoading(false)
      })
  }, [])

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Discovered Creators</h1>

      {loading && <p>Loading creators...</p>}

      {creators.map(c => (
        <div key={c.id} className="border p-4 rounded mb-4">
          <p className="font-semibold">{c.nickname}</p>
          <p className="text-sm text-gray-600">{c.follower_count} followers</p>

          <form method="POST" action="/api/invite" className="mt-2">
            <input type="hidden" name="creator_id" value={c.id} />
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
              Send Invite
            </button>
          </form>
        </div>
      ))}
    </main>
  )
}

