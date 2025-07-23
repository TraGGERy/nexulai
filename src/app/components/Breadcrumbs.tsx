'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import StructuredData, { generateBreadcrumbSchema } from './StructuredData';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    if (!pathname) return;

    // Always start with home
    const pathArray: { name: string; url: string }[] = [
      { name: 'Home', url: 'https://nexusaiconsulting.com' },
    ];

    // Split the pathname and create breadcrumb items
    const pathSegments = pathname.split('/').filter(segment => segment);
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Format the segment name (capitalize, replace hyphens with spaces)
      let name = segment.replace(/-/g, ' ');
      name = name.charAt(0).toUpperCase() + name.slice(1);
      
      // Special case for IDs in routes like /reports/123
      if (index > 0 && pathSegments[index - 1] === 'reports' && !isNaN(Number(segment))) {
        name = `Report ${segment}`;
      }
      
      pathArray.push({
        name,
        url: `https://nexusaiconsulting.com${currentPath}`,
      });
    });

    setBreadcrumbs(pathArray);
  }, [pathname]);

  if (breadcrumbs.length <= 1) return null; // Don't show breadcrumbs on homepage

  return (
    <>
      <nav aria-label="Breadcrumb" className="bg-gray-50 py-2 px-4 sm:px-6 lg:px-8">
        <ol className="flex space-x-2 text-sm text-gray-500">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.url} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 font-medium">{breadcrumb.name}</span>
              ) : (
                <Link 
                  href={breadcrumb.url.replace('https://nexusaiconsulting.com', '')}
                  className="text-purple-600 hover:text-purple-800"
                >
                  {breadcrumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      
      {/* Add structured data for breadcrumbs */}
      <StructuredData data={generateBreadcrumbSchema(breadcrumbs)} />
    </>
  );
}