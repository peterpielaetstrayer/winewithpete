'use client';

import { useState } from 'react';
import type { Event } from '@/lib/types';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', notes: '' });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

  const handleRSVP = async (eventSubmit: React.FormEvent) => {
    eventSubmit.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/events/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, ...formData }),
      });
      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert(result.error || 'Failed to submit RSVP');
      }
    } catch (error) {
      console.error('RSVP error:', error);
      alert('Failed to submit RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFull = !!(event.max_attendees && event.current_attendees >= event.max_attendees);

  if (isSubmitted) {
    return (
      <article className="border border-black/15 p-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9c3d24]">RSVP confirmed</p>
        <h3 className="mt-4 font-serif text-3xl">Your chair is saved.</h3>
        <p className="mt-4 text-sm leading-6 text-black/58">
          You&apos;re on the list for {event.title}. We&apos;ll send the details to your email.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSubmitted(false);
            setIsRSVPOpen(false);
            setFormData({ name: '', email: '', notes: '' });
          }}
          className="mt-6 border-b border-black/35 pb-1 text-xs font-semibold uppercase tracking-[0.16em] text-black/65"
        >
          Back to event
        </button>
      </article>
    );
  }

  return (
    <article className="border border-black/15 p-7 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9c3d24]">
          {event.event_type === 'open_fire_sunday' ? 'Open Fire' : 'Salon Table'}
        </p>
        {event.max_attendees && (
          <p className="text-xs text-black/42">{event.current_attendees}/{event.max_attendees} places</p>
        )}
      </div>

      <h3 className="mt-5 font-serif text-3xl leading-[1.08]">{event.title}</h3>
      <p className="mt-4 text-sm leading-6 text-black/58">{event.description}</p>
      <div className="mt-6 border-y border-black/10 py-4 text-xs leading-6 text-black/52">
        <p>{formatDate(event.event_date)}</p>
        {event.location && <p>{event.location}</p>}
      </div>

      {!isRSVPOpen ? (
        <button
          type="button"
          onClick={() => setIsRSVPOpen(true)}
          disabled={isFull}
          className="mt-6 min-h-11 w-full bg-[#9c3d24] px-5 text-xs font-semibold uppercase tracking-[0.16em] text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFull ? 'Table full' : 'RSVP'}
        </button>
      ) : (
        <form onSubmit={handleRSVP} className="mt-7 space-y-5 border-t border-black/10 pt-6">
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">Name</span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-2 min-h-11 w-full border border-black/20 bg-transparent px-3 outline-none focus:border-[#9c3d24]"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">Email</span>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-2 min-h-11 w-full border border-black/20 bg-transparent px-3 outline-none focus:border-[#9c3d24]"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">Notes</span>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="mt-2 w-full border border-black/20 bg-transparent p-3 outline-none focus:border-[#9c3d24]"
            />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsRSVPOpen(false)}
              className="min-h-11 flex-1 border border-black/25 px-4 text-xs font-semibold uppercase tracking-[0.15em] text-black/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-11 flex-1 bg-[#9c3d24] px-4 text-xs font-semibold uppercase tracking-[0.15em] text-white disabled:opacity-50"
            >
              {isSubmitting ? 'Saving…' : 'Save my chair'}
            </button>
          </div>
        </form>
      )}
    </article>
  );
}
