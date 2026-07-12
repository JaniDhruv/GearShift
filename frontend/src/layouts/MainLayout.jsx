import React from 'react';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Layout foundation shell */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
