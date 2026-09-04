import { neon } from '@neondatabase/serverless';
import { readFile } from 'fs/promises';
import path from 'path';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set. Add it to .env.local first.');
}

const sql = neon(process.env.DATABASE_URL);

async function readJson(name) {
  const filePath = path.join(process.cwd(), 'data', name);
  return JSON.parse(await readFile(filePath, 'utf-8'));
}

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS foods (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      servings JSONB NOT NULL,
      image TEXT NOT NULL,
      calories NUMERIC NOT NULL,
      protein NUMERIC NOT NULL,
      carbs NUMERIC NOT NULL,
      fat NUMERIC NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      food_id TEXT NOT NULL,
      serving TEXT NOT NULL,
      quantity NUMERIC NOT NULL,
      calories NUMERIC NOT NULL,
      protein NUMERIC NOT NULL,
      carbs NUMERIC NOT NULL,
      fat NUMERIC NOT NULL
    )
  `;

  const [{ count: foodCount }] = await sql`SELECT COUNT(*)::int AS count FROM foods`;
  if (foodCount === 0) {
    const foods = await readJson('foods.json');
    for (const food of foods) {
      await sql`
        INSERT INTO foods (id, name, servings, image, calories, protein, carbs, fat)
        VALUES (${food.id}, ${food.name}, ${JSON.stringify(food.servings)}, ${food.image}, ${food.calories}, ${food.protein}, ${food.carbs}, ${food.fat})
        ON CONFLICT (id) DO NOTHING
      `;
    }
    console.log(`Seeded ${foods.length} foods.`);
  } else {
    console.log('foods table already has data, skipping seed.');
  }

  const [{ count: entryCount }] = await sql`SELECT COUNT(*)::int AS count FROM entries`;
  if (entryCount === 0) {
    const entries = await readJson('entries.json');
    for (const entry of entries) {
      await sql`
        INSERT INTO entries (id, date, food_id, serving, quantity, calories, protein, carbs, fat)
        VALUES (${entry.id}, ${entry.date}, ${entry.foodId}, ${entry.serving}, ${entry.quantity}, ${entry.calories}, ${entry.protein}, ${entry.carbs}, ${entry.fat})
        ON CONFLICT (id) DO NOTHING
      `;
    }
    console.log(`Seeded ${entries.length} entries.`);
  } else {
    console.log('entries table already has data, skipping seed.');
  }

  console.log('Migration complete.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
