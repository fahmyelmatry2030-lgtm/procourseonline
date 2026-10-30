'use client';

export function SortSelect({
  defaultValue,
  search,
  status,
  price,
}: {
  defaultValue: string;
  search?: string;
  status?: string;
  price?: string;
}) {
  return (
    <form method="GET">
      {search && <input type="hidden" name="search" value={search} />}
      {status && <input type="hidden" name="status" value={status} />}
      {price && <input type="hidden" name="price" value={price} />}
      <select
        name="sort"
        defaultValue={defaultValue}
        onChange={(e) => (e.target.form as HTMLFormElement).submit()}
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#0EA5E9] cursor-pointer"
      >
        <option value="newest">الأحدث</option>
        <option value="rating">الأعلى تقييماً</option>
        <option value="price_asc">السعر: من الأقل للأعلى</option>
      </select>
    </form>
  );
}
