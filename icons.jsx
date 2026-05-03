// Vialys — shared icons (stroke-based, 1.6px, rounded)
// Pass `size` and `color` props.

const VIcon = {};

const _ico = (name, paths, opts = {}) => {
  VIcon[name] = ({ size = 22, color = 'currentColor', strokeWidth = 1.7, fill = 'none' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {paths}
    </svg>
  );
};

_ico('home', <><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/></>);
_ico('orders', <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></>);
_ico('drop', <><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z"/></>);
_ico('flask', <><path d="M9 3v6L4 19a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 19l-5-10V3"/><path d="M8 3h8"/><path d="M7 14h10"/></>);
_ico('printer', <><path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="8" rx="1.5"/><path d="M8 17v4h8v-4"/><circle cx="17" cy="12.5" r="0.6" fill="currentColor"/></>);
_ico('chart', <><path d="M4 20h16"/><rect x="6" y="11" width="3" height="9"/><rect x="11" y="6" width="3" height="14"/><rect x="16" y="14" width="3" height="6"/></>);
_ico('user', <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>);
_ico('users', <><circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-7 7-7s7 3 7 7"/><path d="M16 4a4 4 0 0 1 0 8"/><path d="M22 21c0-3-1-5-3-6"/></>);
_ico('settings', <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.3l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></>);
_ico('plus', <><path d="M12 5v14M5 12h14"/></>);
_ico('search', <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>);
_ico('check', <><path d="m5 12 5 5L20 7"/></>);
_ico('x', <><path d="M6 6l12 12M18 6 6 18"/></>);
_ico('chevR', <><path d="m9 6 6 6-6 6"/></>);
_ico('chevL', <><path d="m15 6-6 6 6 6"/></>);
_ico('chevD', <><path d="m6 9 6 6 6-6"/></>);
_ico('chevU', <><path d="m6 15 6-6 6 6"/></>);
_ico('camera', <><path d="M4 8h3l2-2h6l2 2h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.5"/></>);
_ico('id', <><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2.5"/><path d="M5 17c.7-1.5 2.2-2.5 4-2.5s3.3 1 4 2.5"/><path d="M14 9h5M14 12h5M14 15h3"/></>);
_ico('clock', <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>);
_ico('bell', <><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 19a2 2 0 0 0 4 0"/></>);
_ico('alert', <><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v5M12 18v.01"/></>);
_ico('logout', <><path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="m15 8 4 4-4 4M19 12H9"/></>);
_ico('switch', <><path d="M7 7h11l-3-3M17 17H6l3 3"/></>);
_ico('download', <><path d="M12 4v12M7 11l5 5 5-5"/><path d="M5 20h14"/></>);
_ico('eye', <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>);
_ico('filter', <><path d="M3 5h18l-7 9v6l-4-2v-4L3 5Z"/></>);
_ico('mic', <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></>);
_ico('shield', <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></>);
_ico('building', <><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/><path d="M10 21v-3h4v3"/></>);
_ico('beaker', <><path d="M9 3h6v5l4 9a2 2 0 0 1-2 3H7a2 2 0 0 1-2-3l4-9V3Z"/><path d="M7 14h10"/></>);
_ico('list', <><path d="M3 6h18M3 12h18M3 18h18"/></>);
_ico('grid', <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>);
_ico('phone', <><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4"/><path d="M12 18h.01"/></>);
_ico('moon', <><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"/></>);
_ico('sun', <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>);
_ico('arrowR', <><path d="M5 12h14M13 6l6 6-6 6"/></>);
_ico('arrowU', <><path d="M12 19V5M6 11l6-6 6 6"/></>);
_ico('arrowD', <><path d="M12 5v14M6 13l6 6 6-6"/></>);
_ico('dot', <circle cx="12" cy="12" r="3" fill="currentColor"/>, { fill: 'currentColor' });
_ico('refresh', <><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 4v4h-4"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 20v-4h4"/></>);
_ico('save', <><path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M7 3v6h8V3"/><path d="M7 14h10v7H7z"/></>);
_ico('edit', <><path d="M4 20h4l10-10-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/></>);

window.VIcon = VIcon;

// Brand mark — V inside a square with a tracked path
window.VialysMark = function VialysMark({ size = 28, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill={light ? '#0D9488' : '#1B3A6B'}/>
      <path d="M9 9.5l5.4 11 .8 1.6h1.4l.8-1.6L23 9.5"
        stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="22.5" cy="9.5" r="2.2" fill="#0D9488" stroke="#fff" strokeWidth="1.4"/>
      <path d="m21.4 9.5.9.9 1.6-1.6" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};
