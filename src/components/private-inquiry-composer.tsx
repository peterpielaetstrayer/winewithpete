'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, Copy } from 'lucide-react';

import {
  composePrivateInquiry,
  type PrivateInquiryDetails,
  type PrivateInquiryKind,
} from '@/lib/private-inquiry';

const emptyDetails: PrivateInquiryDetails = {
  name: '',
  location: '',
  timeframe: '',
  guestCount: '',
  idea: '',
  helpNeeded: '',
};

export function PrivateInquiryComposer({ kind }: { kind: PrivateInquiryKind }) {
  const [details, setDetails] = useState<PrivateInquiryDetails>(emptyDetails);
  const [prepared, setPrepared] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const draft = useMemo(() => composePrivateInquiry(kind, details), [kind, details]);
  const isSignature = kind === 'signature';
  const emailLinkIsShortEnough = draft.mailto.length <= 1900;

  const update = (field: keyof PrivateInquiryDetails, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
    setCopyStatus('');
  };

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draft.copyText);
      setCopyStatus('Copied. Paste it into an email when you’re ready.');
    } catch {
      setCopyStatus('Copy isn’t available in this browser. You can select the message below.');
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setPrepared(true);
      }}
      className="mt-12 max-w-5xl border-t border-white/15 pt-10"
      data-testid={`private-inquiry-${kind}`}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Your name <span className="font-normal normal-case tracking-normal text-white/45">(optional)</span></span>
          <input
            value={details.name}
            onChange={(event) => update('name', event.target.value)}
            maxLength={100}
            autoComplete="name"
            placeholder="What should Pete call you?"
            className="mt-3 min-h-12 w-full rounded-none border border-white/25 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/35 focus-visible:border-[#ffd4b6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd4b6]"
          />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Where would this happen?</span>
          <input
            value={details.location}
            onChange={(event) => update('location', event.target.value)}
            maxLength={160}
            placeholder="City and state, or general area"
            required
            className="mt-3 min-h-12 w-full rounded-none border border-white/25 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/35 focus-visible:border-[#ffd4b6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd4b6]"
          />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/75">When are you imagining?</span>
          <input
            value={details.timeframe}
            onChange={(event) => update('timeframe', event.target.value)}
            maxLength={120}
            placeholder="A date, season, or just exploring"
            className="mt-3 min-h-12 w-full rounded-none border border-white/25 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/35 focus-visible:border-[#ffd4b6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd4b6]"
          />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Roughly how many people?</span>
          <input
            value={details.guestCount}
            onChange={(event) => update('guestCount', event.target.value)}
            maxLength={60}
            placeholder="An estimate is fine"
            className="mt-3 min-h-12 w-full rounded-none border border-white/25 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/35 focus-visible:border-[#ffd4b6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd4b6]"
          />
        </label>
      </div>
      <label className="mt-6 block">
        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/75">What’s bringing everyone together?</span>
        <textarea
          value={details.idea}
          onChange={(event) => update('idea', event.target.value)}
          maxLength={900}
          rows={4}
          required
          placeholder="The occasion, the people, the feeling you want the evening to have..."
          className="mt-3 w-full rounded-none border border-white/25 bg-white/10 p-4 text-base leading-7 text-white outline-none placeholder:text-white/35 focus-visible:border-[#ffd4b6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd4b6]"
        />
      </label>
      <label className="mt-6 block">
        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
          {isSignature ? 'Anything else about the space or the evening?' : 'What would you especially like help planning?'}
          {' '}<span className="font-normal normal-case tracking-normal text-white/45">(optional)</span>
        </span>
        <textarea
          value={details.helpNeeded}
          onChange={(event) => update('helpNeeded', event.target.value)}
          maxLength={500}
          rows={3}
          placeholder={isSignature ? 'The setting, food, wine, a particular tradition...' : 'The menu, the wine, the timing, the atmosphere...'}
          className="mt-3 w-full rounded-none border border-white/25 bg-white/10 p-4 text-base leading-7 text-white outline-none placeholder:text-white/35 focus-visible:border-[#ffd4b6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd4b6]"
        />
      </label>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center bg-[#a64225] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#b94b2b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffd4b6]"
        >
          Prepare an email
        </button>
        <p className="max-w-xl text-sm leading-6 text-white/55">
          This prepares a message in your browser. Nothing is sent to Pete or saved on the site.
        </p>
      </div>

      {prepared && (
        <div className="mt-10 border-t border-white/15 pt-8" data-testid="prepared-inquiry">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffd4b6]" role="status">Your message is ready</p>
          <h3 className="mt-3 font-serif text-3xl leading-tight">Give it a read, then send when you’re ready.</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
            Opening your email app does not send the inquiry automatically. You can edit it there before sending.
          </p>
          <textarea
            aria-label="Prepared inquiry message"
            readOnly
            value={draft.copyText}
            rows={13}
            className="mt-6 w-full rounded-none border border-white/20 bg-black/20 p-4 font-mono text-sm leading-6 text-white/80 focus-visible:outline-2 focus-visible:outline-[#ffd4b6]"
          />
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {emailLinkIsShortEnough && (
              <a
                href={draft.mailto}
                className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#a64225] px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffd4b6]"
                data-testid="open-inquiry-email"
              >
                Open in my email app
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
            <button
              type="button"
              onClick={copyDraft}
              className="inline-flex min-h-12 items-center justify-center gap-3 border border-white/40 px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffd4b6]"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copy the message
            </button>
          </div>
          {!emailLinkIsShortEnough && (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
              This message is a little long for a reliable email-app link. Copy it instead, then paste it into a new email.
            </p>
          )}
          <p className="mt-4 min-h-6 text-sm text-white/65" role="status" aria-live="polite">{copyStatus}</p>
        </div>
      )}
    </form>
  );
}
