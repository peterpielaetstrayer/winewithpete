import { permanentRedirect } from 'next/navigation';

export default function WineWithRedirect() {
  permanentRedirect('/gather');
}
