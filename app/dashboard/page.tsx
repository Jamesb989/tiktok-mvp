// app/dashboard/page.tsx
'use client'
import { useEffect, useState } from 'react'

type Creator = {
  // Assuming the creator ID from TikTok is a string
  id: string
  nickname: string
  follower_count: number
}

export default function Dashboard() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inviteStatus, setInviteStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/creators')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch creators. The session may have expired.');
        }
        return res.json();
      })
      .then(data => {
        // The /v2/user/info/ endpoint returns a single user object, not an array.
        // We'll wrap it in an array to fit the list structure.
        if (data && data.user) {
            const creatorData = {
                id: data.user.open_id,
                nickname: data.user.display_name,
                follower_count: data.user.follower_count,
            };
            setCreators([creatorData]);
        } else {
          // Handle cases where API returns unexpected format or no user
           throw new Error('Unexpected data format from API.');
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [])
  
  // Note: This is an improved, asynchronous version of the form submission.
  // The original <form> approach still works, but this provides a better UX.
  const handleInvite = async (creatorId: string) => {
    setInviteStatus(prev => ({ ...prev, [creatorId]: 'Sending...' }));

    try {
        const response = await fetch('/api/invite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ creator_id: creatorId }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to send invite.');
        }

        setInviteStatus(prev => ({ ...prev, [creatorId]: 'Invite Sent!' }));
    } catch (error: any) {
        setInviteStatus(prev => ({ ...prev, [creatorId]: `Error: ${error.message}` }));
    }
  };


  return (
    <main className="max-w-2xl mx-auto p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Creator Dashboard</h1>
        <a href="/api/auth/logout" className="text-sm text-gray-500 hover:underline">Logout</a>
      </div>


      {loading && <p>Loading creator data...</p>}
      
      {error && <p className="text-red-500 bg-red-100 p-4 rounded">Error: {error} Please try logging out and back in.</p>}

      {!loading && !error && creators.length === 0 && (
          <p>No creator data found.</p>
      )}

      {creators.map(c => (
        <div key={c.id} className="border p-4 rounded mb-4 shadow-sm bg-white">
          <p className="text-xl font-semibold">{c.nickname}</p>
          <p className="text-sm text-gray-600">{c.follower_count.toLocaleString()} followers</p>

          <div className="mt-4">
            <button 
                onClick={() => handleInvite(c.id)}
                disabled={!!inviteStatus[c.id] && inviteStatus[c.id] !== 'Error'}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {inviteStatus[c.id] || 'Send Campaign Invite'}
            </button>
             {inviteStatus[c.id] && inviteStatus[c.id].startsWith('Error') && (
                <p className="text-red-500 text-xs mt-2">{inviteStatus[c.id]}</p>
             )}
          </div>
        </div>
      ))}
    </main>
  )
}