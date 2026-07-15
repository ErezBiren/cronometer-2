'use client';

import { useRouter } from 'next/navigation';

export default function BottomNavbar() {
  const router = useRouter();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 py-3 flex items-center justify-between z-40">
      <button className="flex-1 text-center py-2 text-gray-500 hover:text-gray-700 font-semibold">
        📊
      </button>

      <button
        onClick={() => router.push('/?openAddEntry=true')}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-2xl shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      >
        +
      </button>

      <button className="flex-1 text-center py-2 text-gray-500 hover:text-gray-700 font-semibold">
        ⚙️
      </button>
    </div>
  );
}
