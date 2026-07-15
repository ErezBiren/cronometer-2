'use client';

import { useRouter } from 'next/navigation';

export default function BottomNavbar() {
  const router = useRouter();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 py-3 flex items-center justify-center z-40">
      <button
        onClick={() => router.push('/?openAddEntry=true')}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-2xl shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      >
        +
      </button>
    </div>
  );
}
