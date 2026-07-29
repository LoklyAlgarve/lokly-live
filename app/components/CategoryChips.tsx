const categories = [
  { name: "Music", icon: "🎵" },
  { name: "Food", icon: "🍴" },
  { name: "Markets", icon: "🛍️" },
  { name: "Family", icon: "👨‍👩‍👧" },
  { name: "Sport", icon: "⚽" },
  { name: "Culture", icon: "🎭" },
  { name: "Nightlife", icon: "🌙" },
];

export default function CategoryChips() {
  return (
    <section className="space-y-4">

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-bold text-slate-900">
          Browse by category
        </h3>

        <button className="text-sm font-semibold text-[#149EAF] hover:underline">
          See all
        </button>

      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">

        {categories.map((category) => (
          <button
            key={category.name}
            className="flex min-w-[110px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#149EAF] hover:shadow-md"
          >
            <span className="mb-2 text-2xl">
              {category.icon}
            </span>

            <span className="text-sm font-semibold text-slate-700">
              {category.name}
            </span>
          </button>
        ))}

      </div>

    </section>
  );
}