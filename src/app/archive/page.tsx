import { permanentRedirect } from 'next/navigation';

export default function ArchiveRedirect() {
  permanentRedirect('/journal');
}
