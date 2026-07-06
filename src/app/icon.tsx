import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: '#DC2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Map pin SVG inline */}
        <svg
          width="40"
          height="44"
          viewBox="0 0 40 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pin body */}
          <path
            d="M20 2C11.163 2 4 9.163 4 18C4 29.5 20 42 20 42C20 42 36 29.5 36 18C36 9.163 28.837 2 20 2Z"
            fill="white"
          />
          {/* Pin inner circle */}
          <circle cx="20" cy="18" r="6" fill="#DC2626" />
          {/* Airplane */}
          <path
            d="M28 6L24 10L26.5 11.5L22 16L23.5 17.5L29 14.5L30.5 17L33 15.5L31.5 10L34 7.5L28 6Z"
            fill="white"
            opacity="0.95"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
