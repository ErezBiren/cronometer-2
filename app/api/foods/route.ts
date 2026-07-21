import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'foods.json');
const ENTRIES_FILE = path.join(process.cwd(), 'data', 'entries.json');

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

interface NutritionEntry {
  id: string;
  date: string;
  food: string;
  serving: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

async function syncEntriesWithFood(oldName: string, updatedFood: Food) {
  try {
    const data = await fs.readFile(ENTRIES_FILE, 'utf-8');
    const entries = JSON.parse(data) as NutritionEntry[];

    const synced = entries.map(entry => {
      if (entry.food !== oldName) return entry;

      const serving = updatedFood.servings.find(s => s.label === entry.serving);
      if (!serving) return entry;

      const ratio = (serving.grams * entry.quantity) / 100;
      return {
        ...entry,
        food: updatedFood.name,
        calories: Math.round(updatedFood.calories * ratio),
        protein: Math.round(updatedFood.protein * ratio * 10) / 10,
        carbs: Math.round(updatedFood.carbs * ratio * 10) / 10,
        fat: Math.round(updatedFood.fat * ratio * 10) / 10,
      };
    });

    await fs.writeFile(ENTRIES_FILE, JSON.stringify(synced, null, 2));
  } catch {
    // No entries file yet — nothing to sync
  }
}

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    const defaultFoods: Food[] = [];
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultFoods, null, 2));
  }
}

export async function GET() {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read foods' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataFile();
    const food: Food = await request.json();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const foods = JSON.parse(data) as Food[];

    foods.push(food);
    await fs.writeFile(DATA_FILE, JSON.stringify(foods, null, 2));

    return NextResponse.json(food, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add food' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureDataFile();
    const updatedFood: Food = await request.json();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const foods = JSON.parse(data) as Food[];

    const oldFood = foods.find(f => f.id === updatedFood.id);
    const updated = foods.map(f => (f.id === updatedFood.id ? updatedFood : f));
    await fs.writeFile(DATA_FILE, JSON.stringify(updated, null, 2));

    if (oldFood) {
      await syncEntriesWithFood(oldFood.name, updatedFood);
    }

    return NextResponse.json(updatedFood);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update food' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureDataFile();
    const { id } = await request.json();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const foods = JSON.parse(data) as Food[];

    const filtered = foods.filter(f => f.id !== id);
    await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 });
  }
}
