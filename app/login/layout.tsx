import { ReactNode } from 'react';

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className=' flex flex-col items-center justify-center min-h-screen min-w-screen bg-gray-100'>
        {children}
     </div>
  );
}
