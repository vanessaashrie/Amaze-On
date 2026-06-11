const variants = {
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  yellow: "bg-yellow-100 text-yellow-700",
  blue: "bg-blue-100 text-blue-700",
};

export default function BadgeTag({ label, variant = "green" }) {
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full ${variants[variant]}`}>
      {label}
    </span>
  );
}