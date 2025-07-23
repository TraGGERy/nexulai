import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Nexus AI Consulting - Pricing Plans';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to right, #7c3aed, #4f46e5)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h1
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              color: 'white',
              marginRight: '16px',
            }}
          >
            Nexus AI Consulting
          </h1>
          <div
            style={{
              background: '#10b981',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            AI-Powered
          </div>
        </div>

        <h2
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '30px',
            textAlign: 'center',
          }}
        >
          Simple, Transparent Pricing
        </h2>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '1000px',
            marginBottom: '40px',
          }}
        >
          {/* Free Plan */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
              Starter
            </h3>
            <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '16px' }}>
              For small businesses
            </p>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              $0
            </div>
            <div style={{ fontSize: '16px', color: '#6b7280' }}>
              1 Free Analysis/month
            </div>
          </div>

          {/* Pro Plan */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              transform: 'scale(1.05)',
              border: '2px solid #7c3aed',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-12px',
                background: '#7c3aed',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              MOST POPULAR
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
              Professional
            </h3>
            <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '16px' }}>
              For growing companies
            </p>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#7c3aed', marginBottom: '16px' }}>
              $29.99
            </div>
            <div style={{ fontSize: '16px', color: '#6b7280' }}>
              Unlimited Analyses
            </div>
          </div>

          {/* Enterprise Plan */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
              Enterprise
            </h3>
            <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '16px' }}>
              For large organizations
            </p>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              $299.99
            </div>
            <div style={{ fontSize: '16px', color: '#6b7280' }}>
              White-label & API access
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '24px',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          💰 Save 99% vs Traditional Consulting • ⚡ Get Results in 15 Minutes
        </div>
      </div>
    ),
    { ...size }
  );
}