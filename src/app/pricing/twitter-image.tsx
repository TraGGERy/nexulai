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
          Pricing Plans
        </h2>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '900px',
            marginBottom: '40px',
          }}
        >
          {/* Free Plan */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
              Free
            </h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
              $0
            </div>
          </div>

          {/* Pro Plan */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              transform: 'scale(1.05)',
              border: '2px solid #7c3aed',
            }}
          >
            <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
              Pro
            </h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#7c3aed', marginBottom: '8px' }}>
              $29.99/mo
            </div>
          </div>

          {/* Enterprise Plan */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
              Enterprise
            </h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
              $299.99/yr
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '24px',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            💰 Save 99% vs Traditional Consulting
          </div>
          
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '24px',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            ⚡ Get Results in 15 Minutes
          </div>
          
          <div
            style={{
              marginTop: '16px',
              fontSize: '20px',
              color: 'white',
            }}
          >
            @NexusAIConsult
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}