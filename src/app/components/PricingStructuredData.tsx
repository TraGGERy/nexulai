'use client';

import StructuredData from './StructuredData';

export default function PricingStructuredData() {
  const pricingData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Nexus AI Consulting Services',
    description: 'AI-powered business consulting services delivering McKinsey-quality insights in minutes.',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '0',
      highPrice: '299.99',
      offerCount: '3',
      offers: [
        {
          '@type': 'Offer',
          name: 'Starter Plan',
          description: 'Perfect for small businesses and startups',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://nexusaiconsulting.com/pricing#starter',
          priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        },
        {
          '@type': 'Offer',
          name: 'Professional Plan',
          description: 'For growing companies and consultants',
          price: '29.99',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://nexusaiconsulting.com/pricing#professional',
          priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        },
        {
          '@type': 'Offer',
          name: 'Enterprise Plan',
          description: 'For large organizations and consulting firms',
          price: '299.99',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://nexusaiconsulting.com/pricing#enterprise',
          priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        }
      ]
    },
    brand: {
      '@type': 'Brand',
      name: 'Nexus AI Consulting'
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '4.9',
        bestRating: '5'
      },
      author: {
        '@type': 'Person',
        name: 'John Smith'
      },
      reviewBody: 'Nexus AI Consulting has revolutionized our business strategy process. We get McKinsey-quality insights in just 15 minutes at a fraction of the cost.'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5'
    }
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does AI consulting compare to traditional consulting?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our AI delivers the same quality insights as top-tier consulting firms like McKinsey, but 1000x faster and at 1/100th the cost. No meetings, no delays, just instant results.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is included in the free plan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The free plan includes basic AI analysis capabilities, limited to 1 report per day, with standard templates and basic export options.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do the subscription plans work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our subscription plans are billed monthly ($29.99/month) or annually ($299.99/year, saving 16%). You can upgrade, downgrade, or cancel at any time with no long-term commitments.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I cancel my subscription anytime?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you can cancel your subscription at any time. When you cancel, your subscription will remain active until the end of your current billing period.'
        }
      },
      {
        '@type': 'Question',
        name: 'What happens when I cancel my subscription?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'When you cancel, your subscription will remain active until the end of your current billing period. After that, you\'ll be downgraded to the free plan with a limit of 1 report per day.'
        }
      },
      {
        '@type': 'Question',
        name: 'What if I\'m not satisfied with the results?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer a 30-day money-back guarantee. If you\'re not completely satisfied with our AI insights, we\'ll refund your payment.'
        }
      },
      {
        '@type': 'Question',
        name: 'How accurate is the AI analysis?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our AI is trained on 10,000+ successful business cases and real-time market data. It consistently delivers insights that match or exceed traditional consulting quality.'
        }
      }
    ]
  };

  return (
    <>
      <StructuredData data={pricingData} />
      <StructuredData data={faqData} />
    </>
  );
}