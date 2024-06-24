// app/(unauthorized)/layout.tsx


import '../globals.css'; // Ensure styles are imported
import { AuthProvider } from '@/contexts/authContext';



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