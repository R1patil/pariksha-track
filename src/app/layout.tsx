// import type { Metadata } from "next";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: "Pariksha Track | ಪರೀಕ್ಷಾ ಟ್ರ್ಯಾಕ್",
//   description: "Student English progress tracker for Karnataka Government School students",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="kn">
//       <body>{children}</body>
//     </html>
//   );
// }



import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:       "Pariksha Track | ಪರೀಕ್ಷಾ ಟ್ರ್ಯಾಕ್",
  description: "Karnataka Government School student progress tracker",
  manifest:    "/manifest.json",
  appleWebApp: {
    capable:        true,
    statusBarStyle: "default",
    title:          "Pariksha Track",
  },
};

export const viewport: Viewport = {
  themeColor:    "#6366f1",
  width:         "device-width",
  initialScale:  1,
  maximumScale:  1,
  userScalable:  false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kn">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js')
                .then(r => console.log('SW registered'))
                .catch(e => console.log('SW failed:', e));
            });
          }
        `}} />
      </body>
    </html>
  );
}