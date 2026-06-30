'use client';

import { useState } from 'react';
import { ToolHeader } from '../components/kff/ToolHeader';

// Placeholder images - replace with actual image paths later
const galleryImages = [
  { id: 1, src: '/images/shared/placeholder-1.jpg', alt: 'Placeholder 1', category: 'shared' },
  { id: 2, src: '/images/shared/placeholder-2.jpg', alt: 'Placeholder 2', category: 'shared' },
  { id: 3, src: '/images/league-specific/kkl/placeholder-3.jpg', alt: 'KKL Image', category: 'kkl' },
  { id: 4, src: '/images/league-specific/kdl/placeholder-4.jpg', alt: 'KDL Image', category: 'kdl' },
  { id: 5, src: '/images/league-specific/mmh/placeholder-5.jpg', alt: 'MMH Image', category: 'mmh' },
  { id: 6, src: '/images/league-specific/bsb/placeholder-6.jpg', alt: 'BSB Image', category: 'bsb' },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredImages = filter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', ['--league-color']: 'var(--kff-azure)', ['--league-color-bright']: 'var(--kff-azure-bright)' } as any}>
      <style jsx global>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <ToolHeader code="IMG" kicker="SHARED · UTILITY" title="Image Gallery" backHref="/" backLabel="Home" />

      <main style={{
        position: 'relative',
        zIndex: 1,
        padding: 'var(--space-7) var(--space-6)',
        maxWidth: 'var(--container-xl)',
        margin: '0 auto',
        fontFamily: 'var(--font-body)',
      }}>

        {/* Filter Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '3rem',
          animation: 'slideInUp 0.6s ease-out 0.2s backwards',
        }}>
          {['all', 'shared', 'kkl', 'kdl', 'mmh', 'bsb'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                fontFamily: 'var(--font-display)',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                background: filter === cat 
                  ? 'linear-gradient(135deg, var(--kff-azure), var(--kff-violet))' 
                  : 'rgba(31, 182, 255, 0.1)',
                color: filter === cat ? 'var(--kff-ink-inv)' : 'var(--kff-azure)',
                border: `2px solid ${filter === cat ? 'var(--kff-azure)' : 'rgba(31, 182, 255, 0.3)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) => {
                if (filter !== cat) {
                  e.currentTarget.style.background = 'rgba(31, 182, 255, 0.2)';
                  e.currentTarget.style.borderColor = 'var(--kff-azure)';
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== cat) {
                  e.currentTarget.style.background = 'rgba(31, 182, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(31, 182, 255, 0.3)';
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem',
          animation: 'slideInUp 0.6s ease-out 0.4s backwards',
        }}>
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => openLightbox(index)}
              style={{
                aspectRatio: '1',
                background: 'linear-gradient(135deg, rgba(31, 182, 255, 0.1), rgba(138, 43, 226, 0.1))',
                border: '2px solid rgba(31, 182, 255, 0.3)',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.borderColor = 'var(--kff-azure)';
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(31, 182, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'rgba(31, 182, 255, 0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Placeholder for actual images */}
              <div style={{
                color: 'rgba(31, 182, 255, 0.5)',
                fontSize: '0.9rem',
                fontWeight: 600,
                textAlign: 'center',
                padding: '1rem',
              }}>
                {image.alt}
                <br />
                <span style={{ fontSize: '0.75rem', color: 'rgba(138, 43, 226, 0.5)' }}>
                  Click to view
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Images Instruction */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          background: 'rgba(31, 182, 255, 0.05)',
          border: '2px dashed rgba(31, 182, 255, 0.3)',
          borderRadius: '12px',
          textAlign: 'center',
          animation: 'slideInUp 0.6s ease-out 0.6s backwards',
        }}>
          <p style={{
            color: 'var(--kff-ink)',
            fontSize: '1.1rem',
            lineHeight: '1.6',
          }}>
            Add your images to <code style={{
              color: 'var(--kff-azure)',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
            }}>/public/images/</code> and update the gallery array in this component
          </p>
        </div>
      </main>
      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease-out',
          }}
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'rgba(138, 43, 226, 0.2)',
              border: '2px solid var(--kff-violet)',
              color: 'var(--kff-violet)',
              fontSize: '2rem',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              zIndex: 1001,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(138, 43, 226, 0.4)';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(138, 43, 226, 0.2)';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            ×
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            style={{
              position: 'absolute',
              left: '2rem',
              background: 'rgba(31, 182, 255, 0.2)',
              border: '2px solid var(--kff-azure)',
              color: 'var(--kff-azure)',
              fontSize: '2rem',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              zIndex: 1001,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(31, 182, 255, 0.4)';
              e.currentTarget.style.transform = 'translateX(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(31, 182, 255, 0.2)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            ‹
          </button>

          {/* Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              background: 'linear-gradient(135deg, rgba(31, 182, 255, 0.1), rgba(138, 43, 226, 0.1))',
              border: '3px solid rgba(31, 182, 255, 0.5)',
              borderRadius: '16px',
              padding: '3rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              animation: 'scaleIn 0.3s ease-out',
              boxShadow: '0 0 80px rgba(31, 182, 255, 0.3)',
            }}
          >
            {/* Placeholder for actual image */}
            <div style={{
              width: '600px',
              height: '600px',
              maxWidth: '100%',
              maxHeight: '70vh',
              background: 'linear-gradient(135deg, rgba(31, 182, 255, 0.2), rgba(138, 43, 226, 0.2))',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed rgba(31, 182, 255, 0.3)',
            }}>
              <span style={{
                color: 'rgba(31, 182, 255, 0.6)',
                fontSize: '1.2rem',
                fontWeight: 600,
                textAlign: 'center',
              }}>
                {filteredImages[selectedImage].alt}
              </span>
            </div>

            {/* Image Info */}
            <div style={{
              textAlign: 'center',
              color: 'var(--kff-ink)',
              fontSize: '1.1rem',
            }}>
              <p style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--kff-azure)',
                fontSize: '1.2rem',
                marginBottom: '0.5rem',
              }}>
                {filteredImages[selectedImage].alt}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--kff-ink-mute)' }}>
                {selectedImage + 1} / {filteredImages.length}
              </p>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            style={{
              position: 'absolute',
              right: '2rem',
              background: 'rgba(31, 182, 255, 0.2)',
              border: '2px solid var(--kff-azure)',
              color: 'var(--kff-azure)',
              fontSize: '2rem',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              zIndex: 1001,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(31, 182, 255, 0.4)';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(31, 182, 255, 0.2)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
