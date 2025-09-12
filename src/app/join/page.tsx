'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase/client';

export default function JoinPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/hub');
      }
    });
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || undefined,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          // Create member record
          await supabase
            .from('members')
            .insert({
              user_id: data.user.id,
              email: data.user.email!,
              name: name || null,
              subscription_tier: 'basic'
            });

          setMessage('Check your email for a confirmation link!');
        }
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          router.push('/hub');
        }
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-display mb-4">Join Wine With Pete</h1>
        <p className="text-black/80">
          Access our complete library of open-fire packages, wine pairings, and gathering tools.
        </p>
      </div>

      <div className="card-enhanced p-8">
        <form onSubmit={handleAuth} className="space-y-6">
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                isSignUp
                  ? 'bg-ember text-white'
                  : 'bg-black/5 text-black/70 hover:bg-black/10'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                !isSignUp
                  ? 'bg-ember text-white'
                  : 'bg-black/5 text-black/70 hover:bg-black/10'
              }`}
            >
              Sign In
            </button>
          </div>

          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="focus-ring"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="focus-ring"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="focus-ring"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('error') || message.includes('Error')
                ? 'bg-red-50 text-red-700'
                : 'bg-green-50 text-green-700'
            }`}>
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full btn-ember"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-black/10">
          <h3 className="font-medium mb-4">What you get as a member:</h3>
          <ul className="text-sm text-black/70 space-y-2">
            <li>• Complete access to all open-fire packages</li>
            <li>• Scale recipes to any serving size (2-8+ people)</li>
            <li>• Print-ready shopping lists and recipe cards</li>
            <li>• Wine pairing recommendations</li>
            <li>• Coming soon: AI pairing studio & gathering designer</li>
          </ul>
        </div>
      </div>
    </div>
  );
}