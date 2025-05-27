import { Inter } from 'next/font/google';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import { ParticipantProvider } from '@/context/ParticipantContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Secret Santa App',
  description: 'A fun and interactive Secret Santa game application',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <ParticipantProvider>
            {children}
          </ParticipantProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
} 