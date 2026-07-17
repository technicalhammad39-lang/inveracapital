import dynamic from 'next/dynamic';

const TradingViewWidgetClient = dynamic(
  () => import('./TradingViewWidgetClient'),
  { ssr: false }
);

export default function TradingViewWidget() {
  return <TradingViewWidgetClient />;
}
