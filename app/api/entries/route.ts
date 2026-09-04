import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';

interface NutritionEntry {
  id: string;
  date: string;
  foodId: string;
  serving: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface EntryRow {
  id: string;
  date: string;
  food_id: string;
  serving: string;
  quantity: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

function toEntry(row: EntryRow): NutritionEntry {
  return {
    id: row.id,
    date: row.date,
    foodId: row.food_id,
    serving: row.serving,
    quantity: Number(row.quantity),
    calories: Number(row.calories),
    protein: Number(row.protein),
    carbs: Number(row.carbs),
    fat: Number(row.fat),
  };
}

export async function GET() {
  try {
    const rows = (await sql`SELECT * FROM entries ORDER BY date, id`) as EntryRow[];
    return NextResponse.json(rows.map(toEntry));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const entry: NutritionEntry = await request.json();
    entry.id = Date.now().toString();

    const [row] = (await sql`
      INSERT INTO entries (id, date, food_id, serving, quantity, calories, protein, carbs, fat)
      VALUES (${entry.id}, ${entry.date}, ${entry.foodId}, ${entry.serving}, ${entry.quantity}, ${entry.calories}, ${entry.protein}, ${entry.carbs}, ${entry.fat})
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
    const { id, quantity, serving, calories, protein, carbs, fat } = await request.json();

    const [row] = (await sql`
      UPDATE entries
      SET quantity = ${quantity}, serving = ${serving}, calories = ${calories}, protein = ${protein}, carbs = ${carbs}, fat = ${fat}
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
