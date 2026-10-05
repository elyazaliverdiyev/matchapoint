import React from 'react'

/**
 * Lightweight vector QR Code SVG for https://matchapoint.vercel.app/
 */
export const QRCodeSVG: React.FC<{ size?: number; className?: string }> = ({
  size = 140,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`bg-white p-2 rounded-2xl flex items-center justify-center shadow-lg ${className}`}
    >
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=${size * 2}x${size * 2}&data=https://matchapoint.vercel.app/&bgcolor=ffffff&color=0B1509&margin=0`}
        alt="QR Code to open Matchapoint PWA on phone"
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  )
}
