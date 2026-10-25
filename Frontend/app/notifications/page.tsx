"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import NotificationCard from '@/components/cards/NotificationCard'
import { fetchAccount } from '@/lib/api'
import type { CloseCall, NotificationItem } from '@/lib/demo-data'

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [closeCalls, setCloseCalls] = useState<CloseCall[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchAccount()
        setNotifications(data.notifications)
        setCloseCalls(data.closeCalls)
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch account data')
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [])

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="w-full max-w-xl">
        <div className="bg-gray-900 text-white max-w-xl w-full p-8 rounded-xl shadow-lg border border-gray-800">
          <h1 className="text-3xl font-bold mb-4 text-cyan-400 pb-5">Notifications</h1>
          {loading && <p className="text-gray-400">Loading notifications…</p>}
          {error && <p className="text-red-400">{error}</p>}
          {!loading && !error && notifications.length === 0 && (
            <p className="text-gray-400">No notifications available.</p>
          )}
          {notifications.map((notification) => (
            <Link
              key={notification.notification_id}
              href={`/claims?incident=${notification.incident_id}`}
              className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <NotificationCard {...notification} hint="Open the claim form" />
            </Link>
          ))}

          {closeCalls.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Close calls</h2>
              {closeCalls.map((closeCall) => (
                <Link
                  key={closeCall.id}
                  href={`/map#point-${closeCall.id}`}
                  className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-white mb-4">
                    <h3 className="text-xl font-bold">{closeCall.title}</h3>
                    <p className="text-gray-300">{closeCall.recordedAt}</p>
                    <p className="mt-2">{closeCall.message}</p>
                    <p className="mt-3 text-sm text-cyan-300">Show on the map</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage
