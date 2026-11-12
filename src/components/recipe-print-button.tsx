'use client';

export function RecipePrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center justify-center border border-[#9c3d24] px-5 py-2 text-sm font-semibold text-[#9c3d24] transition-colors hover:bg-[#9c3d24] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9c3d24]"
    >
      Print recipe
    </button>
  );
}
