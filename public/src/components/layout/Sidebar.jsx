// Sidebar.jsx
import { Home, MessageSquare, BarChart2, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r p-4">
      <h1 className="text-xl font-bold mb-6">AI Sales</h1>

      <nav className="space-y-4">
        <a className="flex items-center gap-3 text-gray-700 hover:text-black">
          <Home size={18} /> Overview
        </a>
        <a className="flex items-center gap-3">
          <MessageSquare size={18} /> Conversations
        </a>
        <a className="flex items-center gap-3">
          <BarChart2 size={18} /> Analytics
        </a>
        <a className="flex items-center gap-3">
          <Settings size={18} /> Settings
        </a>
      </nav>
    </div>
  );
}