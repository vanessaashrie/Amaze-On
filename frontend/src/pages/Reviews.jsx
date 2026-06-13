import { useState } from "react";
import LoadingSkeleton from "../components/LoadingSkeleton";
import BadgeTag from "../components/BadgeTag";
import MarkdownPreview from "../components/MarkdownPreview";

export default function Reviews() {
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    setLoading(true);
    setTimeout(() => {
      setResult({ verdict: "Suspicious", confidence: 82, explanation: "This review shows signs of bot-generated text with repetitive phrasing and no verified purchase." });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🔍 Review Authenticity Checker</h2>
      <textarea value={review} onChange={e => setReview(e.target.value)} rows={5} placeholder="Paste a product review here..." className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-gray-500" />
      <button onClick={handleCheck} className="bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition mb-6">Verify Review</button>
      {loading && <LoadingSkeleton count={1} />}
      {result && !loading && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-center">
            <BadgeTag label={result.verdict} variant={result.verdict === "Genuine" ? "green" : "red"} />
            <BadgeTag label={`Confidence: ${result.confidence}%`} variant="yellow" />
          </div>
          <MarkdownPreview content={result.explanation} />
        </div>
      )}
    </div>
  );
}