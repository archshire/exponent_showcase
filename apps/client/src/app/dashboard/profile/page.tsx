import { redirect } from 'next/navigation';

// Profile editing now lives on the Settings page — keep this route as a redirect
// so old links/bookmarks don't 404.
export default function ProfilePage() {
  redirect('/dashboard/settings');
}
