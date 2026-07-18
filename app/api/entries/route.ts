import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'entries.json');

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

async function ensureDataFile() {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

export async function GET() {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataFile();
    const entry: NutritionEntry = await request.json();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const entries = JSON.parse(data) as NutritionEntry[];

    entry.id = Date.now().toString();
    entries.push(entry);

    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureDataFile();
    const { id } = await request.json();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const entries = JSON.parse(data) as NutritionEntry[];

    const filtered = entries.filter(e => e.id !== id);
    await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureDataFile();
    const { id, quantity, serving, calories, protein, carbs, fat } = await request.json();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const entries = JSON.parse(data) as NutritionEntry[];

    const updated = entries.map(e =>
      e.id === id
        ? { ...e, quantity, serving, calories, protein, carbs, fat }
        : e
    );

    await fs.writeFile(DATA_FILE, JSON.stringify(updated, null, 2));
    const updatedEntry = updated.find(e => e.id === id);

    return NextResponse.json(updatedEntry);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}
