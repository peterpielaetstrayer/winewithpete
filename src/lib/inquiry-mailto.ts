const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'pete@winewithpete.me';

export function buildInquiryMailto(
  subject: string,
  imaginationPrompt = 'What kind of table are you imagining?'
) {
  const body = [
    'Name:',
    '',
    'Location:',
    '',
    'Date or timeframe:',
    '',
    'Guest count:',
    '',
    'Occasion or gathering idea:',
    '',
    `${imaginationPrompt}:`,
    '',
  ].join('\n');

  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export { contactEmail };
