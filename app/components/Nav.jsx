'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Scoreboard' },
  { href: '/feed', label: 'Feed' },
  { href: '/thesis', label: 'Thesis' },
  { href: '/fund', label: 'Fund' },
  { href: '/subscribe', label: 'Subscribe' },
  { href: 'https://github.com/MetaSPN/season-one', label: 'GitHub', external: true },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
      paddingBottom: 12,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ fontSize: 9, color: '#4a5568', letterSpacing: 2, textTransform: 'uppercase' }}>
        Marvin · MBH-CSE v0.1 · Conviction Signal Engine
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {links.map(({ href, label, external }) => {
          const active = !external && pathname === href;
          if (external) {
            return (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 10,
                  color: '#4a5568',
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                {label}
              </a>
            );
          }
          return (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: 10,
                color: active ? '#818cf8' : '#4a5568',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                fontWeight: active ? 600 : 500,
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
