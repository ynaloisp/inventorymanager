import { Kodchasan } from 'next/font/google';
import './globals.css';

const kodchasan = Kodchasan({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={kodchasan.className}>
        {children}
      </body>
    </html>
  );
}
