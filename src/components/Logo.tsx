export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Modern cross with curved design */}
      {/* Top-left curve - Turquoise light */}
      <path
        d="M 30 10 L 50 10 L 50 30 C 50 30 45 35 30 35 Z"
        fill="#00BCD4"
      />
      
      {/* Top-right curve - Blue medium */}
      <path
        d="M 50 10 L 70 10 L 85 35 C 85 35 65 35 50 30 Z"
        fill="#0288D1"
      />
      
      {/* Bottom-left curve - Blue medium */}
      <path
        d="M 30 50 C 30 50 35 55 35 70 L 15 85 L 15 65 C 15 65 20 50 30 50 Z"
        fill="#0288D1"
      />
      
      {/* Bottom-right curve - Turquoise light */}
      <path
        d="M 50 70 C 50 70 55 75 70 75 L 70 95 L 50 95 Z"
        fill="#00BCD4"
      />
      
      {/* Center connecting piece - Blue dark */}
      <path
        d="M 42 35 L 58 35 L 58 42 L 65 42 L 65 58 L 58 58 L 58 65 L 42 65 L 42 58 L 35 58 L 35 42 L 42 42 Z"
        fill="#01579B"
      />
    </svg>
  );
}
