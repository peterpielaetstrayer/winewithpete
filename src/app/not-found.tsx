import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-sm border">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <Image src="/images/icons/icon-fire.png" alt="404" width={48} height={48} />
          </div>
          <h1 className="text-4xl font-serif font-medium mb-4 text-charcoal">Page Not Found</h1>
          <p className="text-lg text-black/70 mb-8">
            The page you&apos;re looking for doesn&apos;t exist. Maybe it got lost in the fire?
          </p>
          <div className="space-y-4">
            <Link href="/">
              <Button className="btn-ember px-8 py-4 rounded-full text-lg font-medium">
                Back to Home
              </Button>
            </Link>
            <div className="text-sm text-black/60">
              <p>Or explore our <Link href="/gatherings" className="text-ember hover:underline">gatherings</Link> or <Link href="/recipes" className="text-ember hover:underline">recipes</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
