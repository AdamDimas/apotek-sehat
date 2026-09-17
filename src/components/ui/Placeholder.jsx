export default function Placeholder({ title, note }) {
  return (
    <div className="p-7">
      <div className="bg-surface border border-line rounded-xl p-10 text-center max-w-lg mx-auto mt-6">
        <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary-ink flex items-center justify-center mx-auto text-xl font-bold">
          {title.charAt(0)}
        </div>
        <h2 className="mt-4 text-[15px] font-semibold">Halaman {title}</h2>
        <p className="mt-1 text-sm text-muted">{note}</p>
      </div>
    </div>
  );
}
