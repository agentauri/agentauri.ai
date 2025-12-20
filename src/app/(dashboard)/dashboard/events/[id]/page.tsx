'use client'

import Link from 'next/link'
import { use } from 'react'
import { Button } from '@/components/atoms/button'
import { LoadingSkeleton } from '@/components/molecules'
import { EventDetail } from '@/components/organisms'
import { useEvent } from '@/hooks'

interface EventDetailPageProps {
  params: Promise<{ id: string }>
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = use(params)

  const { data: event, isLoading, error } = useEvent(id)

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <LoadingSkeleton count={1} height={100} />
        <LoadingSkeleton count={2} height={200} />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="h-screen bg-terminal flex flex-col items-center justify-center gap-4">
        <p className="text-destructive typo-ui glow">[!] EVENT NOT FOUND</p>
        <p className="text-terminal-dim typo-ui">
          {error instanceof Error ? error.message : 'The event could not be loaded'}
        </p>
        <Button asChild variant="outline" className="typo-ui">
          <Link href="/dashboard/events">[&lt;] BACK TO EVENTS</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b-2 border-terminal pb-6">
        <Link
          href="/dashboard/events"
          className="typo-ui text-terminal-dim hover:text-terminal-green transition-colors"
        >
          [&lt;] BACK
        </Link>
        <div className="flex-1">
          <h1 className="typo-header text-terminal-green glow">
            EVENT #{event.blockNumber.toLocaleString()}
          </h1>
          <p className="typo-ui text-terminal-dim mt-1">{event.eventType}</p>
        </div>
      </div>

      {/* Event Detail */}
      <EventDetail event={event} />
    </div>
  )
}
