import { useEffect, useState } from 'react';
import { getSettings } from '../api/client';

function normalizePhone(number) {
  return String(number || '').replace(/[^\d]/g, '');
}

export function WhatsAppButton() {
  const [phone, setPhone] = useState('923230000000');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const setting = await getSettings();
        if (mounted && setting?.whatsappNumber) {
          const normalized = normalizePhone(setting.whatsappNumber);
          if (normalized) setPhone(normalized);
        }
      } catch (_err) {
        // Keep fallback number when API is unavailable.
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <a
      href={`https://wa.me/923250026250`}
      target="_blank"
      rel="noreferrer"
      aria-label="Order on WhatsApp"
      className="fixed bottom-4 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1f9d49] text-white shadow-lg transition hover:scale-105"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.43 0 .06 5.37.06 12c0 2.1.55 4.15 1.58 5.95L0 24l6.27-1.64a11.9 11.9 0 0 0 5.79 1.49h.01c6.62 0 11.99-5.37 11.99-12 0-3.2-1.25-6.2-3.54-8.37Zm-8.45 18.3h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.22-3.72.98.99-3.63-.24-.37a9.86 9.86 0 0 1-1.52-5.27c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.12 1.03 6.99 2.91a9.83 9.83 0 0 1 2.9 6.99c0 5.46-4.44 9.9-9.89 9.9Zm5.43-7.42c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.76.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.36-1.46a8.82 8.82 0 0 1-1.63-2.03c-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.57-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.45 1.06 2.86 1.2 3.06.15.2 2.08 3.18 5.03 4.46.7.3 1.25.49 1.67.62.7.22 1.34.19 1.84.12.56-.08 1.75-.72 2-1.42.25-.7.25-1.31.17-1.43-.07-.12-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}
