import { useEffect, useState } from 'react';
import { getSettings } from '../api/client';

export function TopBar() {
  const [whatsAppNumber, setWhatsAppNumber] = useState('92 325 0026250');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const setting = await getSettings();
        if (mounted && setting?.whatsappNumber) {
          setWhatsAppNumber(setting.whatsappNumber);
        }
      } catch (_err) {
        // Keep fallback number when settings API is unavailable.
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-brand-900 text-[11px] font-semibold text-brand-50">
      <div className="section-shell flex min-h-8 items-center justify-between gap-3 py-1 sm:text-xs">
        <span className="truncate">Delivery Across Pakistan</span>
        <span className="hidden truncate md:inline">Pure Quality • Healthy Choice</span>
        <span className="truncate">WhatsApp: {whatsAppNumber}</span>
      </div>
    </div>
  );
}
