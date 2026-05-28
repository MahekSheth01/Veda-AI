import React from 'react';
import styles from './EmptyState.module.css';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function EmptyState() {
  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.illustrationsWrapper}>
          <img src="/empty-state.png" alt="No Assignments" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        <div className={styles.textWrapper}>
          <div className={styles.noAssignments}>No assignments yet</div>
          <div className={styles.subText}>
            Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
          </div>
        </div>

        <Link href="/assignments/create" className={styles.createBtn}>
          <Plus size={20} color="#FFFFFF" />
          <span className={styles.createBtnText}>Create Your First Assignment</span>
        </Link>
      </div>
    </div>
  );
}
