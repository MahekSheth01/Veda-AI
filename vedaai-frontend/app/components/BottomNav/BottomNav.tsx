'use client';
import React from 'react';
import styles from './BottomNav.module.css';
import { Home, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const currentPath = usePathname() || '/assignments';

  return (
    <div className={styles.bottomNavContainer}>
      <div className={styles.floatingActionWrapper}>
        <Link href="/assignments/create" className={styles.fabBtn}>
          <Plus size={24} color="#FF5623" strokeWidth={3} />
        </Link>
      </div>
      
      <nav className={styles.bottomNav}>
        <Link href="/" className={`${styles.navItem} ${currentPath === '/' ? styles.active : ''}`}>
          <div className={styles.iconWrapper}>
            <Home size={20} />
          </div>
          <span>Home</span>
        </Link>
        <Link href="/assignments" className={`${styles.navItem} ${currentPath.includes('/assignments') ? styles.active : ''}`}>
          <div className={styles.iconWrapper}>
            <img src="/Calendar.png" alt="Assignments" style={{ width: 20, height: 20, objectFit: 'contain' }} />
          </div>
          <span>Assignments</span>
        </Link>
        <Link href="/library" className={`${styles.navItem} ${currentPath.includes('/library') ? styles.active : ''}`}>
          <div className={styles.iconWrapper}>
            <img src="/file-text_plus.png" alt="Library" style={{ width: 20, height: 20, objectFit: 'contain' }} />
          </div>
          <span>Library</span>
        </Link>
        <Link href="/toolkit" className={`${styles.navItem} ${currentPath.includes('/toolkit') ? styles.active : ''}`}>
          <div className={styles.iconWrapper}>
            <img src="/Frame 1618872409 (1).png" alt="AI Toolkit" style={{ width: 20, height: 20, objectFit: 'contain' }} />
          </div>
          <span>AI Toolkit</span>
        </Link>
      </nav>
    </div>
  );
}
