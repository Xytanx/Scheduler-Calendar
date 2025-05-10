import React from "react"
import dayjs from "dayjs"
import { CalendarEventType, useEventStore } from "@/lib/store"

type EventRendererProps = {
  date: dayjs.Dayjs
  view: "month" | "week" | "day"
  events: CalendarEventType[]
}

export function EventRenderer({ date, view, events }: EventRendererProps) {
  const { openEventSummary } = useEventStore()

  const filteredEvents = events.filter((event) => {
    if (view === "month") {
      return event.date.isSame(date, "day")
    }
    if (view === "week") {
      return event.date.isSame(date, "hour")
    }
    if (view === "day") {
      return event.date.isSame(date, "hour")
    }
    return false
  })

  return (
    <>
      {filteredEvents.map((event) => (
        <div
          key={event.id}
          onClick={(e) => {
            e.stopPropagation()
            openEventSummary(event)
          }}
          className="line-clamp-1 w-[90%] cursor-pointer rounded-sm p-1 text-sm text-white"
          style={{ backgroundColor: event.color }}
        >
          {event.title}
        </div>
      ))}
    </>
  )
}
