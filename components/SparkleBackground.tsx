import React from 'react';

const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Layer 1: Base Static Starfield (very subtle) */}
      <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'15\' cy=\'15\' r=\'0.5\' fill=\'white\' opacity=\'0.1\'/%3E%3Ccircle cx=\'75\' cy=\'40\' r=\'0.5\' fill=\'white\' opacity=\'0.1\'/%3E%3Ccircle cx=\'45\' cy=\'80\' r=\'0.5\' fill=\'white\' opacity=\'0.1\'/%3E%3C/svg%3E")' }}></div>

      {/* Layer 2: Animated "Jammed" Aurora Gradients */}
      {/* Central Highlight (Teal) */}
      <div className="absolute -inset-1/2 animate-aurora opacity-20 mix-blend-soft-light" style={{ animationDelay: '0s', background: 'radial-gradient(ellipse at 50% 50%, #0f766e, transparent 40%)' }}></div>
      {/* Corner Blob (Purple) */}
      <div className="absolute -inset-1/2 animate-aurora opacity-15 mix-blend-soft-light" style={{ animationDelay: '30s', background: 'radial-gradient(circle at 20% 80%, #6d28d9, transparent 40%)' }}></div>
      {/* Corner Blob (Indigo) */}
      <div className="absolute -inset-1/2 animate-aurora opacity-15 mix-blend-soft-light" style={{ animationDelay: '60s', background: 'radial-gradient(circle at 80% 20%, #3730a3, transparent 40%)' }}></div>
      
      {/* Layer 3: Panning Grid for depth and tech feel */}
      <div 
        className="absolute inset-0 animate-pan opacity-[0.02]"
        style={{
          width: '200%',
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '3rem 3rem',
        }}
      ></div>
      
      {/* Layer 4: Twinkling Stars */}
      {Array.from({ length: 30 }).map((_, i) => {
        const size = Math.random() * 1.5 + 0.5;
        const duration = Math.random() * 4 + 3; // 3s to 7s
        const delay = Math.random() * 7;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.3)',
            }}
          />
        );
      })}
    </div>
  );
};

export default ParticleBackground;