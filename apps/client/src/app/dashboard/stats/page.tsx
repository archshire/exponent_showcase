import { redirect } from 'next/navigation';

// Your record now lives on the Home hub — keep this route as a redirect so old
// links/bookmarks don't 404.
export default function StatsPage() {
  redirect('/dashboard');
}
