import { ShareViewer } from './ShareViewer';

export const metadata = {
  title: 'Shared journey funnel',
};

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ShareViewer token={token} />;
}
