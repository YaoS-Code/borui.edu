import '../styles/globals.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Borui Education | Math & Coding in Vancouver & Richmond',
  description: 'Expert math and coding classes for students in Vancouver & Richmond, specializing in Singapore Math, AP Courses, and Math Competitions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
