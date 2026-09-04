import { Suspense } from 'react';
import HomeContent from '@/app/components/HomeContent';

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900" />}>
      <HomeContent />
    </Suspense>
  );
}
