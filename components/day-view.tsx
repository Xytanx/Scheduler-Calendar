import { useDateStore, useEventStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import dayjs from "dayjs"
import React, { useEffect, useState } from "react"
import { ScrollArea } from "./ui/scroll-area"
import { getHours, isCurrentDay } from "@/lib/getTime"
import { EventRenderer } from "./event-renderer"

export default function DayView() {
  const [currentTime, setCurrentTime] = useState(dayjs())
  const { openPopover, events } = useEventStore()
  const { userSelectedDate, setDate } = useDateStore()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const isToday =
    userSelectedDate.format("DD-MM-YY") === dayjs().format("DD-MM-YY")

  return (
    <>
      <div className="grid grid-cols-[auto_auto_1fr] px-4">
        <div className="w-16 border-r border-gray-300 text-xs">GMT +2</div>
        <div className="flex w-16 flex-col items-center">
          <div className={cn("text-xs", isToday && "text-blue-600")}>{userSelectedDate.format("ddd")}</div>
          <div
            className={cn(
              "h-12 w-12 rounded-full p-2 text-2xl",
              isToday && "bg-blue-600 text-white"
            )}
          >
            {userSelectedDate.format("DD")}
          </div>
        </div>
        <div />
      </div>

      <ScrollArea className="h-[70vh]">
        <div className="grid grid-cols-[auto_1fr] p-4">
          <div className="w-16 border-r border-gray-300">
            {getHours.map((hour, index) => (
              <div key={index} className="relative h-16">
                <div className="absolute -top-2 text-xs text-gray-600">
                  {hour.format("HH:mm")}
                </div>
              </div>
            ))}
          </div>

          <div className="relative border-r border-gray-300">
            {getHours.map((hour, i) => {
              const slotDate = userSelectedDate.hour(hour.hour())
              const eventsAtSlot = events.filter(evt =>
                dayjs(evt.date).isSame(slotDate, 'hour')
              )

              return (
                <div
                  key={i}
                  className="relative flex h-16 border-b border-gray-300 hover:bg-gray-100"
                  onClick={() => {
                    setDate(slotDate)
                    openPopover()
                  }}
                >
                  {eventsAtSlot.map((eventItem, idx) => {
                    const width = 100 / eventsAtSlot.length
                    const leftOffset = width * idx
                    return (
                      <div
                        key={eventItem.id}
                        className="absolute top-1"
                        style={{
                          width: `${width}%`,
                          left: `${leftOffset}%`
                        }}
                      >
                        <EventRenderer
                          events={[eventItem]}
                          date={slotDate}
                          view="day"
                        />
                      </div>
                    )
                  })}
                </div>
              )
            })}

            {isCurrentDay(userSelectedDate) && (
              <div
                className={cn("absolute h-0.5 w-full bg-red-500")}
                style={{ top: `${(currentTime.hour() / 24) * 100}%` }}
              />
            )}
          </div>
        </div>
      </ScrollArea>
    </>
  )
}
