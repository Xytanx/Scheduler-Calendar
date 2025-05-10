'use server'

import { db } from "@/db/drizzle"
import { eventsTable } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

export async function createEvent(
  formData: FormData
): Promise<{ error: string } | { success: boolean }> {
  const title       = formData.get("title")       as string
  const description = formData.get("description") as string
  const timestamp   = formData.get("timestamp")   as string
  const color       = formData.get("color")       as string

  if (!title || !description || !timestamp || !color) {
    return { error: "All fields are required" }
  }

  const dateTime = new Date(timestamp)

  try {
    await db.insert(eventsTable).values({
      title,
      description,
      date:  dateTime,
      color,
    })
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("Error creating event:", err)
    return { error: "Failed to create event" }
  }
}

export async function deleteEvent(
  id: string
): Promise<{ error: string } | { success: boolean }> {
  const numericId = Number(id)
  if (Number.isNaN(numericId)) {
    return { error: "Invalid event ID" }
  }

  try {
    const deleted = await db
      .delete(eventsTable)
      .where(eq(eventsTable.id, numericId))
      .returning()

    if (deleted.length === 0) {
      return { error: `No event found with ID ${numericId}` }
    }

    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("Error deleting event:", err)
    return { error: "Failed to delete event" }
  }
}
