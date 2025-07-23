'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StructuredDataProps {
  data: Record<string, any>;
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nexus AI Consulting',
    url: 'https://nexusaiconsulting.com',
    logo: 'https://nexusaiconsulting.com/logo.png',
    sameAs: [
      'https://twitter.com/NexusAIConsult',
      'https://www.linkedin.com/company/nexus-ai-consulting',
      'https://www.facebook.com/NexusAIConsulting',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-123-4567',
      contactType: 'customer service',
      email: 'contact@nexusaiconsulting.com',
      availableLanguage: ['English'],
    },
    description: 'Revolutionary AI-powered consulting platform delivering McKinsey-quality insights in just 15 minutes.',
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Nexus AI Consulting',
    url: 'https://nexusaiconsulting.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://nexusaiconsulting.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'AI-Powered Business Consulting',
    provider: {
      '@type': 'Organization',
      name: 'Nexus AI Consulting',
      url: 'https://nexusaiconsulting.com',
    },
    description: 'Revolutionary AI-powered consulting platform delivering McKinsey-quality insights in just 15 minutes.',
    offers: {
      '@type': 'Offer',
      price: '49.99',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };
}

export function generateFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does Nexus AI Consulting work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our AI-powered platform analyzes your business data and provides McKinsey-quality insights in just 15 minutes. Simply input your business challenge, and our AI will generate a comprehensive analysis and actionable recommendations.',
        },
      },
      {
        '@type': 'Question',
        name: 'How accurate are the AI-generated insights?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our AI platform has been trained on thousands of business cases and delivers 99% accuracy compared to traditional consulting services. Each analysis is backed by data-driven insights and industry best practices.',
        },
      },
      {
        '@type': 'Question',
        name: 'What types of business challenges can Nexus AI Consulting help with?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our platform can help with a wide range of business challenges including strategy development, market analysis, operational excellence, financial analysis, and digital transformation.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does Nexus AI Consulting cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our pricing starts at just $49.99 per month for the Basic plan, which is approximately 1/100th the cost of traditional consulting services. We also offer Pro and Enterprise plans with additional features and capabilities.',
        },
      },
    ],
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function usePageSchema() {
  const pathname = usePathname();
  const [schema, setSchema] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    // Generate different schema based on the current page
    if (pathname === '/') {
      // Homepage schema
      setSchema({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Nexus AI Consulting - AI-Powered Business Solutions',
        description: 'Revolutionary AI-powered consulting platform delivering McKinsey-quality insights in just 15 minutes.',
        url: 'https://nexusaiconsulting.com',
        mainEntity: {
          '@type': 'Organization',
          name: 'Nexus AI Consulting',
          url: 'https://nexusaiconsulting.com',
        },
      });
    } else if (pathname === '/pricing') {
      // Pricing page schema
      setSchema({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Pricing - Nexus AI Consulting',
        description: 'Affordable pricing plans for AI-powered business consulting services.',
        url: `https://nexusaiconsulting.com${pathname}`,
        mainEntity: {
          '@type': 'PriceSpecification',
          name: 'Nexus AI Consulting Pricing Plans',
          description: 'Pricing plans for AI-powered business consulting services.',
        },
      });
    } else if (pathname === '/solutions') {
      // Solutions page schema
      setSchema({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Solutions - Nexus AI Consulting',
        description: 'AI-powered business solutions for strategy, operations, and digital transformation.',
        url: `https://nexusaiconsulting.com${pathname}`,
        mainEntity: {
          '@type': 'ItemList',
          name: 'Nexus AI Consulting Solutions',
          description: 'Our range of AI-powered business solutions.',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Strategy Consulting',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Market Intelligence',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Operational Excellence',
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: 'Financial Analysis',
            },
          ],
        },
      });
    } else if (pathname === '/ai-tools') {
      // AI Tools page schema
      setSchema({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'AI Tools - Nexus AI Consulting',
        description: 'Advanced AI tools for business analysis and consulting.',
        url: `https://nexusaiconsulting.com${pathname}`,
        mainEntity: {
          '@type': 'ItemList',
          name: 'Nexus AI Consulting Tools',
          description: 'Our suite of AI-powered business tools.',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Strategy Analyzer',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Market Intelligence Engine',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Operations Optimizer',
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: 'Financial Forecaster',
            },
          ],
        },
      });
    } else {
      // Default schema for other pages
      setSchema({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Nexus AI Consulting',
        description: 'AI-powered business consulting services.',
        url: `https://nexusaiconsulting.com${pathname}`,
      });
    }
  }, [pathname]);

  return schema;
}