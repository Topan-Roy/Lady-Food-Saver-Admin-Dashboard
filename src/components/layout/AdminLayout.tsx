import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
interface AdminLayoutProps {
  children: React.ReactNode;
}
export function AdminLayout({
  children
}: AdminLayoutProps) {
  return <div className="min-h-screen bg-[#FAF7F5]">
      <Sidebar />
      <div className="pl-64">
        <TopBar />
        <main className="p-8 max-w-[1600px] mx-auto">{children}</main>
      </div>
    </div>;
}