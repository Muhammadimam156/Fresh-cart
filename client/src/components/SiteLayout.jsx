import { Outlet } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { TopBar } from './TopBar';
import { WhatsAppButton } from './WhatsAppButton';

export function SiteLayout() {
  return (
    <div className="min-h-screen bg-organic-cream text-organic-ink">
      <TopBar />
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}