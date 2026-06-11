import { useState } from "react";
import ProductCard from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import MarkdownPreview from "../components/MarkdownPreview";

export default function Sustainability() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setTimeout(() => {
      setResult({ title: query, score: 78, badge: "🌿 Eco Friendly", description: "This product has a low carbon footprint and uses recycled materials." });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🌿 Sustainable Shopping</h2>
      <div className="flex gap-3 mb-8">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a product..." className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400" />
        <button onClick={handleSearch} className="bg-orange-400 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-500 transition">Search</button>
      </div>
      {loading && <LoadingSkeleton count={2} />}
      {result && !loading && (
        <div className="flex flex-col gap-4">
          <ProductCard title={result.title} score={result.score} badge={result.badge} description={result.description} />
          <MarkdownPreview content={`✅ Eco Score: ${result.score}/100\n\n${result.description}`} />
        </div>
      )}
    </div>
  );
}