export const metadata = {
  title: 'Contact Management System',
  description: 'aMFAccess - Contact Management System',
};

import '../styles/globals.css';
import '../index.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


