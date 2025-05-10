'use client'

import React, { useRef, useEffect } from 'react'
import dayjs from 'dayjs'
import { Button } from "@/components/ui/button"
import { IoCloseSharp } from "react-icons/io5"
import { CalendarEventType, useEventStore } from '@/lib/store'
import { deleteEvent as deleteEventServer } from "@/app/actions/event-actions"

interface EventSummaryPopoverProps {
  isOpen: boolean
  onClose: () => void
  event: CalendarEventType
}

export function EventSummaryPopover({
  isOpen,
  onClose,
  event,
}: EventSummaryPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const deleteEventInStore = useEventStore((s) => s.deleteEvent)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleDelete = async () => {
    // 1) Optimistically update client state
    deleteEventInStore(event.id)

    // 2) Invoke your server action
    const result = await deleteEventServer(event.id)
    if ("error" in result) {
      console.error("Server delete failed:", result.error)
      // TODO: rollback state or show a toast
    }

    // 3) Always close the popover
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        ref={popoverRef}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Event Summary</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <IoCloseSharp className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <p><strong>Title:</strong> {event.title}</p>
          <p><strong>Date:</strong> {dayjs(event.date).format("dddd, MMMM D, YYYY h:mm A")}</p>
          {event.description && <p><strong>Description:</strong> {event.description}</p>}
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="destructive" onClick={handleDelete}>
            Delete Event
          </Button>
        </div>
      </div>
    </div>
  )
}
