import { sql } from '@/app/lib/db';
import type { NutritionEntry } from '@/app/lib/calculations';

// Server-only data access. Used by the Home page (Server Component) for the
// initial render, and by the /api route handlers for mutations, so both
// stay in sync on row shape and avoid duplicating the mapping logic.

export interface EntryRow {
  id: string;
  date: string;
  time: string;
  food_id: string;
  serving: string;
  quantity: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export function toEntry(row: EntryRow): NutritionEntry {
  return {
    id: row.id,
    date: row.date,
    time: row.time,
    foodId: row.food_id,
    serving: row.serving,
    quantity: Number(row.quantity),
    calories: Number(row.calories),
    protein: Number(row.protein),
    carbs: Number(row.carbs),
    fat: Number(row.fat),
  };
}

export async function getEntries(): Promise<NutritionEntry[]> {
  const rows = (await sql`SELECT * FROM entries ORDER BY date, id`) as EntryRow[];
  return rows.map(toEntry);
}

export interface Serving {
  label: string;
  grams: number;
}

export interface Food {
  id: string;
  name: string;
  servings: Serving[];
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodRow {
  id: string;
  name: string;
  servings: Serving[];
  image: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export function toFood(row: FoodRow): Food {
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

export async function getFoods(): Promise<Food[]> {
  const rows = (await sql`SELECT * FROM foods ORDER BY name`) as FoodRow[];
  return rows.map(toFood);
}
