'use client';

import React from 'react';
import styles from './Sidebar.module.css';
import { Home, Users, FileText, Wrench, BookOpen, Settings, Plus, BarChart2, LayoutGrid, PieChart, Book, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAssignmentStore } from '../../store/assignmentStore';

export default function Sidebar() {
  const { assignments } = useAssignmentStore();
  const pathname = usePathname();

  let sidebarHeight = '756px'; // empty state
  if (pathname === '/assignments/create') {
    sidebarHeight = '744px';
  } else if (pathname === '/assignments/output') {
    sidebarHeight = '724px';
  } else if (assignments.length > 0) {
    sidebarHeight = '820px';
  }

  return (
    <aside className={styles.sidebar} style={{ height: sidebarHeight }}>
      <div className={styles.innerContainer}>
        {/* LOGO SECTION */}
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            <img src="/Frame 1618872393.png" alt="VedaAI Logo" className={styles.mainLogoImg} />
          </div>
        </div>

        {/* CREATE BUTTON / ACTION BUTTON */}
        <div className={styles.createAction}>
          {pathname === '/assignments/output' ? (
            <Link href="/toolkit" className={styles.createBtn}>
              <div className={styles.createBtnIconWrapper}>
                <img src="/Frame 1618872409 (1).png" alt="Icon" className={styles.createBtnIcon} />
              </div>
              <div className={styles.createBtnText}>AI Teacher's Toolkit</div>
            </Link>
          ) : (
            <Link href="/assignments/create" className={styles.createBtn}>
              <div className={styles.createBtnIconWrapper}>
                <img src="/Frame 1618872409 (1).png" alt="Icon" className={styles.createBtnIcon} />
              </div>
              <div className={styles.createBtnText}>Create Assignment</div>
            </Link>
          )}
        </div>

        {/* MENU */}
        <nav className={styles.menuBlock}>
          <Link href="/" className={`${styles.menuItem} ${styles.menuItemHome}`}>
            <LayoutGrid size={20} />
            <span className={styles.menuItemText}>Home</span>
          </Link>
          
          <Link href="/groups" className={styles.menuItem}>
            <img src="/group-icon.png" alt="Groups" style={{ width: '20px', height: '20px' }} />
            <span className={styles.menuItemText}>My Groups</span>
          </Link>
          
          <Link href="/assignments" className={`${styles.menuItem} ${styles.menuItemActive}`}>
            <img src="/assignment-icon.png" alt="Assignments" style={{ width: '20px', height: '20px' }} />
            <span className={styles.menuItemText} style={assignments.length > 0 ? { width: '160px', flex: 'none' } : {}}>Assignments</span>
            {assignments.length > 0 && (
              <div className={styles.badge}>
                {assignments.length}
              </div>
            )}
          </Link>
          
          <Link href="/toolkit" className={styles.menuItem}>
            <Book size={20} />
            <span className={styles.menuItemText}>AI Teacher's Toolkit</span>
          </Link>
          
          <Link href="/library" className={styles.menuItem}>
            <PieChart size={20} />
            <span className={styles.menuItemText}>My Library</span>
          </Link>


        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className={styles.bottomBlock}>
        <Link href="/settings" className={styles.menuItem} style={{width: '256px', marginBottom: '8px'}}>
          <Settings size={20} />
          <span className={styles.menuItemText}>Settings</span>
        </Link>
        
        <div className={styles.profileCard}>
          <div className={styles.profileInner}>
            <img src="/profile.jpg" alt="Profile" className={styles.avatar} style={{ objectFit: 'cover' }} />
            <div className={styles.profileContent}>
              <div className={styles.schoolName}>Delhi Public School</div>
              <div className={styles.schoolCity}>Bokaro Steel City</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
