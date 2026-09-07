import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';
import { getEntries, toEntry, type EntryRow } from '@/app/lib/data';
import type { NutritionEntry } from '@/app/lib/calculations';

export async function GET() {
  try {
    return NextResponse.json(await getEntries());
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const entry: NutritionEntry = await request.json();
    entry.id = Date.now().toString();

    const [row] = (await sql`
      INSERT INTO entries (id, date, time, food_id, serving, quantity, calories, protein, carbs, fat)
      VALUES (${entry.id}, ${entry.date}, ${entry.time}, ${entry.foodId}, ${entry.serving}, ${entry.quantity}, ${entry.calories}, ${entry.protein}, ${entry.carbs}, ${entry.fat})
      RETURNING *
    `) as EntryRow[];

    return NextResponse.json(toEntry(row), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await sql`DELETE FROM entries WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, quantity, serving, time, calories, protein, carbs, fat } = await request.json();

    const [row] = (await sql`
      UPDATE entries
      SET quantity = ${quantity}, serving = ${serving}, time = ${time}, calories = ${calories}, protein = ${protein}, carbs = ${carbs}, fat = ${fat}
      WHERE id = ${id}
      RETURNING *
    `) as EntryRow[];

    if (!row) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json(toEntry(row));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}
