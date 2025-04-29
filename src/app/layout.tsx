import { Inter } from 'next/font/google';
import ThemeProvider from './theme';
import StoreProvider from '@/store/StoreProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Log Metrics Dashboard',
  description: 'A dashboard for monitoring and analyzing log metrics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
