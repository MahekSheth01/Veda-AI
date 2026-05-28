'use client';
import React from 'react';
import styles from './Header.module.css';
import { Bell, ArrowLeft, ChevronDown, LayoutGrid, Menu, Sparkles } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const isOutputPage = pathname === '/assignments/output';
  const isCreatePage = pathname === '/assignments/create';

  const handleBack = () => {
    if (isOutputPage) {
      router.push('/assignments/create');
    } else if (isCreatePage) {
      router.push('/assignments');
    } else {
      router.push('/assignments');
    }
  };

  return (
    <header className={styles.header}>
      {/* Left side */}
      <div className={styles.leftSide}>
        <div className={styles.desktopBreadcrumb}>
          <button className={styles.backBtn} onClick={handleBack}>
            <ArrowLeft size={20} color="#303030" strokeWidth={2} />
          </button>
          <span className={styles.breadcrumb}>
            {isOutputPage ? (
              <>
                <Sparkles size={18} style={{ marginRight: '8px' }} />
                Create New
              </>
            ) : (
              <>
                <LayoutGrid size={18} style={{ marginRight: '8px' }} />
                Assignment
              </>
            )}
          </span>
        </div>
        <div className={styles.mobileLogo}>
          <img src="/mobile-logo.png" alt="VedaAI Logo" style={{ width: '99px', height: '28px', opacity: 1, objectFit: 'contain' }} />
        </div>
      </div>

      {/* Right side */}
      <div className={styles.rightSide}>
        <div className={styles.bellWrapper}>
          <Bell size={18} color="#303030" />
          <div className={styles.dot}></div>
        </div>

        <div className={styles.profileWrapper}>
          <img src="/profile.jpg" alt="John Doe" className={styles.profileAvatar} />
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>John Doe</span>
            <ChevronDown className={styles.chevron} size={16} color="#303030" />
          </div>
        </div>

        <button className={styles.mobileMenuBtn}>
          <Menu size={24} color="#303030" />
        </button>
      </div>
    </header>
  );
}
