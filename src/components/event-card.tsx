'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Event } from '@/lib/types';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notes: ''
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/events/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          ...formData
        }),
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

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-medium mb-2 text-charcoal">RSVP Confirmed!</h3>
          <p className="text-black/70 mb-4">
            You&apos;re all set for {event.title}. We&apos;ll send you a confirmation email shortly.
          </p>
          <Button 
            onClick={() => {
              setIsSubmitted(false);
              setIsRSVPOpen(false);
              setFormData({ name: '', email: '', notes: '' });
            }}
            variant="outline"
            className="border-ember text-ember hover:bg-ember hover:text-white"
          >
            RSVP for Another Event
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-enhanced bg-white rounded-2xl p-8 shadow-sm border">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-ember">
            {event.event_type === 'open_fire_sunday' ? '🔥 Open Fire Sunday' : '🍷 Salon Dinner'}
          </span>
          {event.max_attendees && (
            <span className="text-sm text-black/60">
              ({event.current_attendees}/{event.max_attendees} spots)
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-medium mb-2 text-charcoal">{event.title}</h3>
        
        <p className="text-black/70 mb-4">{event.description}</p>
        
        <div className="space-y-2 text-sm text-black/60">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(event.event_date)}
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </div>
          )}
        </div>
      </div>

      {!isRSVPOpen ? (
        <Button 
          onClick={() => setIsRSVPOpen(true)}
          className="w-full btn-ember focus-ring"
          disabled={!!(event.max_attendees && event.current_attendees >= event.max_attendees)}
        >
          {event.max_attendees && event.current_attendees >= event.max_attendees 
            ? 'Event Full' 
            : 'RSVP Now'
          }
        </Button>
      ) : (
        <form onSubmit={handleRSVP} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">
              Name *
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
              Email *
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-charcoal mb-2">
              Notes (optional)
            </label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any dietary restrictions, questions, or notes..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRSVPOpen(false)}
              className="flex-1 border-ember text-ember hover:bg-ember hover:text-white focus-ring"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-ember focus-ring"
            >
              {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
