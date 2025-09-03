export function SiteFooter(){
  return (
    <footer className="border-t border-black/5">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-2 text-sm opacity-80">
        <p>© {new Date().getFullYear()} Wine With Pete</p>
        <p>Fire • Food • Slow conversation</p>
      </div>
    </footer>
  );
}
