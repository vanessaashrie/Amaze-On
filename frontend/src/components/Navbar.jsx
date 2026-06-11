import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="text-2xl font-bold text-orange-400">🛒 Amaze-On</div>
      <div className="flex gap-6">
        <Link to="/" className="hover:text-orange-400 transition">Home</Link>
        <Link to="/sustainability" className="hover:text-orange-400 transition">Eco Shop</Link>
        <Link to="/reviews" className="hover:text-orange-400 transition">Review Checker</Link>
        <Link to="/chat" className="hover:text-orange-400 transition">AI Chat</Link>
      </div>
    </nav>
  );
}