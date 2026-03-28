'use client';

import { useState, useEffect } from 'react';

export default function Admin() {
  const [waitlist, setWaitlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/waitlist')
      .then(res => res.json())
      .then(data => {
        setWaitlist(data.emails || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">📧 Waitlist Admin</h1>
        
        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : waitlist.length === 0 ? (
          <div className="bg-zinc-800 rounded-xl p-6 text-center">
            <p className="text-zinc-400 text-lg">No waitlist signups yet!</p>
            <p className="text-zinc-500 text-sm mt-2">Share your site to get people to sign up.</p>
            <a href="/" className="inline-block mt-4 text-blue-400 hover:underline">← Go to site</a>
          </div>
        ) : (
          <>
            <p className="text-zinc-400 mb-4">{waitlist.length} people on the waitlist</p>
            <div className="bg-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">#</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.map((email, i) => (
                    <tr key={i} className="border-t border-zinc-700">
                      <td className="px-4 py-3 text-zinc-500">{i + 1}</td>
                      <td className="px-4 py-3">{email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <a href="/" className="inline-block mt-4 text-blue-400 hover:underline">← Go to site</a>
          </>
        )}
      </div>
    </div>
  );
}