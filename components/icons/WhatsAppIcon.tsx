import React from 'react';

const WhatsAppIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.4 5.6a9.4 9.4 0 00-12.8 0 9.4 9.4 0 000 12.8 9.4 9.4 0 0012.8 0 9.3 9.3 0 000-12.8zM7.2 15.2l.5 1.5-1 .5c-1.3-2.3-1.3-5 0-7.3l1 .5-.5 1.5a4.7 4.7 0 000 4.3zm6-1.5a1.2 1.2 0 100-2.3 1.2 1.2 0 000 2.3zm-3.6 0a1.2 1.2 0 100-2.3 1.2 1.2 0 000 2.3zm8.3.2c.4-.7.6-1.5.6-2.3a4.7 4.7 0 00-2-3.8l-1-1.2.7-1c2 2 2.7 5 1.7 7.3z"
    />
  </svg>
);

export default WhatsAppIcon;
