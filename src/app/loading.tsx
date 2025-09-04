export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-ember border-t-transparent rounded-full"></div>
        </div>
        <p className="text-lg text-black/70">Loading...</p>
      </div>
    </div>
  );
}
