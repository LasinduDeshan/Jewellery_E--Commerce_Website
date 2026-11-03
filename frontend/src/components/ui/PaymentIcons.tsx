import React from 'react';

export function VisaIcon({ className = 'h-3.5 max-w-[34px] w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 12" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
      <path
        d="M14.34 0.79L9.42 11.74H6.2L3.78 2.81C3.64 2.26 3.5 2.06 3.07 1.82C2.36 1.43 1.28 1.08 0.26 0.86L0.34 0.52H5.35C6.01 0.52 6.59 0.96 6.74 1.7L8.03 8.42L11.16 0.79H14.34ZM26.93 7.99C26.95 4.98 22.67 4.82 22.7 3.49C22.71 3.08 23.1 2.65 23.97 2.54C24.41 2.48 25.61 2.43 26.96 3.05L27.51 0.55C26.76 0.28 25.8 0.02 24.59 0.02C21.6 0.02 19.5 1.58 19.49 3.81C19.46 5.46 20.98 6.38 22.13 6.93C23.31 7.49 23.7 7.85 23.69 8.36C23.68 9.14 22.73 9.48 21.88 9.5C20.36 9.52 19.46 9.09 18.76 8.77L18.2 11.36C18.92 11.69 20.24 11.98 21.6 11.99C24.77 11.99 26.92 10.45 26.93 7.99ZM34.88 11.74H37.69L35.26 0.79H32.64C32.06 0.79 31.56 1.12 31.34 1.64L26.77 11.74H29.96L30.6 9.99H34.49L34.88 11.74ZM31.48 7.61L33.08 3.31L34 7.61H31.48ZM18.95 0.79L16.43 11.74H13.42L15.93 0.79H18.95Z"
        fill="#1434CB"
      />
    </svg>
  );
}

export function MastercardIcon({ className = 'h-4 max-w-[34px] w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
      <circle cx="11" cy="10" r="7.5" fill="#EB001B" />
      <circle cx="21" cy="10" r="7.5" fill="#F79E1B" fillOpacity="0.92" />
      <path
        d="M16 4.95a7.48 7.48 0 0 1 2.8 5.05 7.48 7.48 0 0 1-2.8 5.05 7.48 7.48 0 0 1-2.8-5.05 7.48 7.48 0 0 1 2.8-5.05z"
        fill="#FF5F00"
      />
    </svg>
  );
}

export function AmexIcon({ className = 'h-3.5 max-w-[34px] w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 38 18" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="American Express">
      <rect width="38" height="18" rx="2" fill="#006FCF" />
      <path
        d="M3.2 14.5l3.1-10.5h2l3.1 10.5h-1.9l-.7-2.5H5.8l-.7 2.5H3.2zm3-4.2h2.3l-1.1-4-1.2 4zm6.1-6.3h2.7l1.6 4 1.6-4h2.7v10.5h-1.8V8.9l-1.5 4.3h-1.3l-1.5-4.3v5.6h-1.8V4zm9.8 0h5.5v2h-3.6v2h3.2v2h-3.2v2.5h3.7v2h-5.6V4zm6.5 0h2l1.6 3.1 1.6-3.1h2l-2.6 4.7 2.8 5.8h-2.1l-1.7-3.8-1.7 3.8h-2.1l2.8-5.8-2.6-4.7z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function ApplePayIcon({ className = 'h-3.5 max-w-[34px] w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 38 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Apple Pay">
      <path
        d="M6.88 7.62c0-1.85 1.5-2.74 1.58-2.78-.86-1.26-2.2-1.42-2.67-1.45-1.14-.11-2.22.67-2.8.67-.58 0-1.47-.66-2.42-.64-1.24.02-2.38.72-3.02 1.83-1.3 2.25-.33 5.57.93 7.38.62.89 1.35 1.89 2.31 1.85.93-.04 1.28-.6 2.41-.6 1.13 0 1.44.6 2.42.58.99-.02 1.62-.9 2.23-1.79.7-.1 1-.2 1.02-.2-.02-.01-1.97-.75-1.97-2.99zM5.46 2.45c.51-.62.86-1.49.76-2.35-.74.03-1.62.49-2.15 1.1-.46.54-.86 1.42-.76 2.26.82.06 1.65-.41 2.15-1.01z"
        fill="#000000"
      />
      <text x="11.5" y="11.5" fill="#000000" fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Inter, sans-serif" fontWeight="600" fontSize="10.5px" letterSpacing="-0.2px">Pay</text>
    </svg>
  );
}

export function GooglePayIcon({ className = 'h-3.5 max-w-[34px] w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 38 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google Pay">
      <path
        d="M6.19 6.59v2.23h3.5c-.14.92-1.06 2.7-3.5 2.7-2.1 0-3.82-1.74-3.82-3.89s1.72-3.89 3.82-3.89c1.2 0 2 .51 2.46.95l1.76-1.7C9.28 1.96 7.9 1.2 6.19 1.2 2.77 1.2 0 3.97 0 7.39s2.77 6.19 6.19 6.19c3.58 0 5.95-2.51 5.95-6.06 0-.41-.05-.72-.1-.94H6.19z"
        fill="#4285F4"
      />
      <text x="13" y="11.5" fill="#3c4043" fontFamily="-apple-system, BlinkMacSystemFont, Roboto, Inter, sans-serif" fontWeight="600" fontSize="10.5px" letterSpacing="-0.2px">Pay</text>
    </svg>
  );
}

export function PaypalIcon({ className = 'h-3.5 max-w-[34px] w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PayPal">
      <path
        d="M8.5 1.8h4.6c2.5 0 4.2 1.3 3.8 3.8-.4 2.6-2.2 3.8-4.7 3.8h-1.8l-1 6H6.4l2.1-13.6z"
        fill="#003087"
      />
      <path
        d="M11.4 5.2h4.2c2.2 0 3.8 1.1 3.4 3.4-.4 2.3-2 3.4-4.2 3.4h-1.6l-.9 5.6h-2.9l2-12.4z"
        fill="#0079C1"
      />
      <path
        d="M13.1 8.6h1.8c2.2 0 3.8-1.1 3.4-3.4a3.4 3.4 0 0 0-.6-1.7c-.6 1.4-1.8 2.4-3.6 2.4h-1.6l-.6 3.9.6-1.2z"
        fill="#002069"
      />
      <text x="20" y="11.5" fill="#003087" fontFamily="-apple-system, BlinkMacSystemFont, Inter, sans-serif" fontWeight="700" fontSize="9px" fontStyle="italic">Pal</text>
    </svg>
  );
}

export function AcceptedPaymentMethods({ className = '' }: { className?: string }) {
  const methods = [
    { name: 'Visa', icon: <VisaIcon /> },
    { name: 'Mastercard', icon: <MastercardIcon /> },
    { name: 'AMEX', icon: <AmexIcon /> },
    { name: 'Apple Pay', icon: <ApplePayIcon /> },
    { name: 'Google Pay', icon: <GooglePayIcon /> },
    { name: 'PayPal', icon: <PaypalIcon /> },
  ];

  return (
    <div className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`}>
      {methods.map((method) => (
        <span
          key={method.name}
          title={method.name}
          className="w-11 h-7 rounded-md bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-center p-1 shrink-0 hover:border-neutral-400 hover:shadow-xs transition-all"
        >
          {method.icon}
        </span>
      ))}
    </div>
  );
}
