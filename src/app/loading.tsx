export default function Loading() {
  return (
    <main className="flex min-h-[62vh] items-center bg-[#f4efe7] px-5 py-20 text-[#211d19] sm:px-8 md:px-12 lg:px-16">
      <div className="mx-auto w-full max-w-5xl border-y border-black/15 py-16 text-center">
        <div className="mx-auto h-px w-28 overflow-hidden bg-black/10">
          <div className="h-full w-1/2 animate-pulse bg-[#9c3d24]" />
        </div>
        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.24em] text-black/42">Setting the table</p>
      </div>
    </main>
  );
}
