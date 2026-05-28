import React from 'react';
import styles from './Layout.module.css';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import BottomNav from '../BottomNav/BottomNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
