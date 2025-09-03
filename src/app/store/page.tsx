export default function StorePage(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-serif">Store</h1>
      <p className="mt-3 text-black/70">Printful-powered merch. Catalog coming soon.</p>
      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1,2,3].map((i)=>(
          <div key={i} className="bg-white border rounded-xl p-4 h-56 grid place-content-center opacity-60">
            Product placeholder
          </div>
        ))}
      </div>
    </div>
  );
}
