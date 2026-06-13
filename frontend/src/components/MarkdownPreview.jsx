export default function MarkdownPreview({ content }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
      {content || "AI response will appear here..."}
    </div>
  );
}