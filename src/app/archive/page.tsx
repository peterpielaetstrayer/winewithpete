export default function ArchivePage(){
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-serif">Archive</h1>
      <p className="mt-4 text-black/70">Latest essays from Substack:</p>
      <div className="mt-6">
        {/* Replace src with your Substack embed when ready */}
        <iframe
          src="https://substack.com/embed"
          className="w-full h-[600px] bg-white rounded-2xl border"
        />
      </div>
    </div>
  );
}
