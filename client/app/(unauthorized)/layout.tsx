// app/(unauthorized)/layout.tsx

import { Roboto } from 'next/font/google';
import '../globals.css'; // Ensure styles are imported
import { AuthProvider } from '@/contexts/authContext';

const roboto = Roboto({ weight: '400', style: 'normal', subsets: ['latin'] });

export default function UnauthorizedLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div >
        {children}
      </div>
    );
  }