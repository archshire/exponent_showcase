import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Exponent — Math Duel Arena',
    short_name: 'Exponent',
    start_url: '/dashboard/solo',
    display: 'standalone',
    background_color: '#07111f',
    theme_color: '#07111f',
  };
}
