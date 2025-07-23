import React from 'react';

export default function JsonLd({ jsonLd }: { jsonLd: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function generateOrganizationJsonLd() {
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

export function generateWebsiteJsonLd() {
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

export function generateServiceJsonLd() {
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

export function generateFaqJsonLd() {
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