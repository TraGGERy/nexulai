'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CanonicalUrl() {
  const pathname = usePathname();
  const [canonicalUrl, setCanonicalUrl] = useState('');

  useEffect(() => {
    // Set the base URL - in production this would be your actual domain
    const baseUrl = 'https://nexusaiconsulting.com';
    // Combine with the current path
    setCanonicalUrl(`${baseUrl}${pathname}`);
  }, [pathname]);

  return (
    <>
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </>
  );
}