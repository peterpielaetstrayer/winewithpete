import { contactEmail } from '@/lib/inquiry-mailto';

export type PrivateInquiryKind = 'signature' | 'blueprint';

export type PrivateInquiryDetails = {
  name: string;
  location: string;
  timeframe: string;
  guestCount: string;
  idea: string;
  helpNeeded: string;
};

export function composePrivateInquiry(kind: PrivateInquiryKind, details: PrivateInquiryDetails) {
  const isSignature = kind === 'signature';
  const subject = isSignature ? 'Signature Table inquiry' : 'Gathering Blueprint inquiry';
  const introduction = isSignature
    ? "I'd like to talk about a Signature Table you might design and host."
    : "I'd like to talk about a Gathering Blueprint for an evening I'd host myself.";
  const helpLabel = isSignature
    ? 'Anything else about the space or the evening'
    : "What I'd especially like help planning";

  const body = [
    'Hi Pete,',
    '',
    introduction,
    '',
    `Where: ${details.location.trim()}`,
    `When: ${details.timeframe.trim() || 'Flexible / not sure yet'}`,
    `Rough guest count: ${details.guestCount.trim() || 'Still deciding'}`,
    '',
    'The gathering I have in mind:',
    details.idea.trim(),
    ...(details.helpNeeded.trim() ? ['', `${helpLabel}:`, details.helpNeeded.trim()] : []),
    '',
    details.name.trim() ? `Thank you,\n${details.name.trim()}` : 'Thank you',
  ].join('\n');

  return {
    subject,
    body,
    mailto: `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    copyText: `To: ${contactEmail}\nSubject: ${subject}\n\n${body}`,
  };
}
