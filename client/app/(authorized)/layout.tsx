// app/(authorized)/layout.tsx

import { Roboto } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/contexts/authContext';
import '../globals.css'; // Ensure styles are imported

const roboto = Roboto({ weight: '400', style: 'normal', subsets: ['latin'] });

export default function AuthorizedLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div >
        <Navbar />
        {children}
      </div>
    );
  }
