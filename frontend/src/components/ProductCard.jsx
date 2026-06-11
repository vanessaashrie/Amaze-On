export default function ProductCard({ title, score, badge, description, onClick }) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-xl transition border border-gray-100 hover:border-orange-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {badge && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">{badge}</span>}
      </div>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
      {score !== undefined && (
        <>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-400 h-2 rounded-full transition-all" style={{ width: `${score}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">Score: {score}/100</p>
        </>
      )}
    </div>
  );
}