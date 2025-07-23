import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Nexus AI Consulting - AI-Powered Business Solutions';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(to bottom right, #F5F3FF, #EFF6FF, #EEF2FF)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            fontSize: 72, 
            fontWeight: 'bold', 
            color: '#6D28D9',
            marginBottom: 20,
          }}>
            Nexus AI Consulting
          </div>
        </div>
        
        <div style={{ 
          fontSize: 36, 
          color: '#1F2937',
          marginBottom: 40,
        }}>
          AI-Powered Business Solutions
        </div>
        
        <div style={{ 
          fontSize: 28, 
          color: '#4B5563',
          marginBottom: 60,
        }}>
          McKinsey-quality insights in just 15 minutes
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: 40,
          marginBottom: 60,
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10,
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 20, 
              backgroundColor: '#E9D5FF',
            }} />
            <div style={{ color: '#6D28D9', fontSize: 24 }}>⚡ Fast</div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10,
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 20, 
              backgroundColor: '#E9D5FF',
            }} />
            <div style={{ color: '#6D28D9', fontSize: 24 }}>🎯 Accurate</div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10,
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 20, 
              backgroundColor: '#E9D5FF',
            }} />
            <div style={{ color: '#6D28D9', fontSize: 24 }}>💰 Affordable</div>
          </div>
        </div>
        
        <div style={{ 
          color: '#6D28D9', 
          fontSize: 24,
          fontWeight: 'bold',
        }}>
          @NexusAIConsult
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}