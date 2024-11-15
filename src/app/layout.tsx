import '../styles/globals.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: 'Borui Education | Math & Coding in Vancouver & Richmond',
  description: 'Expert math and coding classes for students in Vancouver & Richmond, specializing in Singapore Math, AP Courses, and Math Competitions.',
};
// src/app/layout.tsx

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} dynamic>
      <html lang="en">
        <body>
          <NavBar/>
          {children}
          <Footer/>
        </body>
      </html>
    </ClerkProvider>
  );
}
