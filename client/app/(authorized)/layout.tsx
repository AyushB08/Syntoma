import { Roboto } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/contexts/authContext';
import '../globals.css'; 
import Footer from '@/components/Footer';
import Script from 'next/script';

const roboto = Roboto({ weight: '400', style: 'normal', subsets: ['latin'] });

export default function AuthorizedLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div>
        <Script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js" />
        <Script src="https://files.bpcontent.cloud/2024/10/07/00/20241007001812-DRS2S6MV.js" />
        <Navbar />
        {children}
        {/*<Footer/>*/}
      </div>
    );
  }