import './globals.css';
import Nav from './components/Nav';

export const metadata = {
  title: 'MetaSPN · Season 1',
  description: 'Tracking the validation distance between creators and their AI agents.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Background grid */}
        <div className="bg-grid" />
        {/* Scanline effect */}
        <div className="scanlines" />
        <div className="main-container">
          <Nav />
          {children}
        </div>
      </body>
    </html>
  );
}
