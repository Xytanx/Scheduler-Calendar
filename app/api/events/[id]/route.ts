// app/api/events/[id]/route.ts

import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";           // your initialized Drizzle client
import { eventsTable } from "@/db/schema"; // the schema you just updated
import { eq } from "drizzle-orm";

interface Params {
  params: { id: string };
}

export async function DELETE(
  _req: Request,
  { params }: Params
) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid event id" },
      { status: 400 }
    );
  }

  try {
    const deleted = await db
      .delete(eventsTable)
      .where(eq(eventsTable.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: `No event found with id ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event deleted", deleted: deleted[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/events/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
