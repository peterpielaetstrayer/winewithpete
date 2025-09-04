import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-sm border">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <img src="/images/icons/icon-fire.png" alt="404" className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-serif font-medium mb-4 text-charcoal">Page Not Found</h1>
          <p className="text-lg text-black/70 mb-8">
            The page you're looking for doesn't exist. Maybe it got lost in the fire?
          </p>
          <div className="space-y-4">
            <Link href="/">
              <Button className="btn-ember px-8 py-4 rounded-full text-lg font-medium">
                Back to Home
              </Button>
            </Link>
            <div className="text-sm text-black/60">
              <p>Or explore our <Link href="/events" className="text-ember hover:underline">events</Link> or <Link href="/store" className="text-ember hover:underline">store</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
