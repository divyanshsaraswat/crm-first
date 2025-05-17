import { ReactNode } from 'react';

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* No sidebar/topbar here */}
        {children}
      </body>
    </html>
  );
}
