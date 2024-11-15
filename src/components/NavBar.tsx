'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/Navbar.module.css';
import { UserButton } from '@clerk/nextjs';


const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li>
          <Link href="/" className={isActive('/') ? styles.active : ''}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/blog" className={isActive('/blog') ? styles.active : ''}>
            Blog
          </Link>
        </li>
        <li>
          <Link href="https://edu.borui.ca" className={isActive('/courses') ? styles.active : ''}>
            Online Course
          </Link>
        </li>
        {/* <li>
          <Link href="/about" className={isActive('/about') ? styles.active : ''}>
            About Us
          </Link>
        </li> */}
        <li>
          <Link href="/contact" className={isActive('/contact') ? styles.active : ''}>
            Contact
          </Link>
        </li>
        <li>
          <Link href="/account" className={isActive('/account') ? styles.active : ''}>
            Account
          </Link>
        </li>
        <li>
          <UserButton />
        </li>
      </ul>

    </nav>
  );
};

export default Navbar;
