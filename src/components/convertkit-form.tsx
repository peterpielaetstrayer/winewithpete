'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ConvertKitFormProps {
  formId?: string;
  onSuccess?: () => void;
  buttonText?: string;
  placeholder?: string;
  className?: string;
}

export function ConvertKitForm({ 
  formId, 
  onSuccess,
  buttonText = "Get the Free Quick Start Guide",
  placeholder = "your@email.com",
  className = ""
}: ConvertKitFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Form ID is not needed for Kit.co API, but we keep it for compatibility

      // Use Kit API for December Reset
      const response = await fetch('/api/kit/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response. Check server logs.');
      }

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(result.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      console.error('Kit subscription error:', err);
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`text-center ${className}`}>
        <div className="inline-flex items-center gap-2 text-dr-sage font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Check your email for the Quick Start Guide!</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
          className="flex-1 min-h-[44px] text-base"
          aria-label="Email address"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-dr-terracotta hover:bg-dr-terracotta/90 text-white min-h-[44px] px-8 font-medium transition-all hover:scale-105"
        >
          {isSubmitting ? 'Submitting...' : buttonText}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-600 text-center" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

