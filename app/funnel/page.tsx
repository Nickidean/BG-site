import { authConfigured, isAuthed } from '@/lib/funnel/auth';
import { FunnelApp } from './FunnelApp';
import { LoginGate } from './LoginGate';

export const metadata = {
  title: 'Journey Funnels',
};

export default async function FunnelPage() {
  const required = authConfigured();
  if (required && !(await isAuthed())) {
    return <LoginGate />;
  }
  return <FunnelApp authRequired={required} />;
}
