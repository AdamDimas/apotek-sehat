export default function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="flex gap-1">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="px-2.5 py-1 rounded border border-line disabled:opacity-40"
      >
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-2.5 py-1 rounded ${p === page ? "bg-primary text-white" : "border border-line"}`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="px-2.5 py-1 rounded border border-line disabled:opacity-40"
      >
        ›
      </button>
    </div>
  );
}
