import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';

interface Serving {
  label: string;
  grams: number;
}

interface Food {
  id: string;
  name: string;
  servings: Serving[];
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodRow {
  id: string;
  name: string;
  servings: Serving[];
  image: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

function toFood(row: FoodRow): Food {
  return {
    id: row.id,
    name: row.name,
    servings: row.servings,
    image: row.image,
    calories: Number(row.calories),
    protein: Number(row.protein),
    carbs: Number(row.carbs),
    fat: Number(row.fat),
  };
}

async function syncEntriesWithFood(updatedFood: Food) {
  const entries = (await sql`
    SELECT id, serving, quantity FROM entries WHERE food_id = ${updatedFood.id}
  `) as { id: string; serving: string; quantity: string }[];

  for (const entry of entries) {
    const serving = updatedFood.servings.find(s => s.label === entry.serving);
    if (!serving) continue;

    const ratio = (serving.grams * Number(entry.quantity)) / 100;
    const calories = Math.round(updatedFood.calories * ratio);
    const protein = Math.round(updatedFood.protein * ratio * 10) / 10;
    const carbs = Math.round(updatedFood.carbs * ratio * 10) / 10;
    const fat = Math.round(updatedFood.fat * ratio * 10) / 10;

    await sql`
      UPDATE entries
      SET calories = ${calories}, protein = ${protein}, carbs = ${carbs}, fat = ${fat}
      WHERE id = ${entry.id}
    `;
  }
}

export async function GET() {
  try {
    const rows = (await sql`SELECT * FROM foods ORDER BY name`) as FoodRow[];
    return NextResponse.json(rows.map(toFood));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read foods' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const food: Food = await request.json();

    const [row] = (await sql`
      INSERT INTO foods (id, name, servings, image, calories, protein, carbs, fat)
      VALUES (${food.id}, ${food.name}, ${JSON.stringify(food.servings)}, ${food.image}, ${food.calories}, ${food.protein}, ${food.carbs}, ${food.fat})
      RETURNING *
    `) as FoodRow[];

    return NextResponse.json(toFood(row), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add food' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedFood: Food = await request.json();

    const [row] = (await sql`
      UPDATE foods
      SET name = ${updatedFood.name}, servings = ${JSON.stringify(updatedFood.servings)}, image = ${updatedFood.image},
          calories = ${updatedFood.calories}, protein = ${updatedFood.protein}, carbs = ${updatedFood.carbs}, fat = ${updatedFood.fat}
      WHERE id = ${updatedFood.id}
      RETURNING *
    `) as FoodRow[];

    if (!row) {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 });
    }

    await syncEntriesWithFood(toFood(row));

    return NextResponse.json(toFood(row));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update food' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await sql`DELETE FROM foods WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 });
  }
}
