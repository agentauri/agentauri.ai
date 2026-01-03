'use client'

import Link from 'next/link'
import { use } from 'react'
import { Button } from '@/components/atoms/button'
import { DetailPageHeader, LoadingSkeleton } from '@/components/molecules'
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
      <DetailPageHeader
        backHref="/dashboard/events"
        title={`EVENT #${event.blockNumber.toLocaleString()}`}
        subtitle={event.eventType}
      />

      {/* Event Detail */}
      <EventDetail event={event} />
    </div>
  )
}
