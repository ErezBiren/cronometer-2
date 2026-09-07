import { Suspense } from 'react';
import HomeContent from '@/app/components/HomeContent';
import { getEntries, getFoods } from '@/app/lib/data';

// The dashboard shows live data that mutations (add/edit/delete) must be
// reflected on the very next load, so this route always renders per-request
// rather than being prerendered/cached at build time.
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900" />}>
      <HomeData />
    </Suspense>
  );
}

// Fetches entries and foods on the server so the client gets fully-formed
// HTML/data on first paint, instead of hydrating an empty dashboard and then
// fetching from the client (which used to add a JS-parse + hydrate + fetch
// waterfall on top of the DB round trip — the main cause of slow mobile loads).
async function HomeData() {
  const [entries, foods] = await Promise.all([getEntries(), getFoods()]);
  return <HomeContent initialEntries={entries} initialFoods={foods} />;
}
