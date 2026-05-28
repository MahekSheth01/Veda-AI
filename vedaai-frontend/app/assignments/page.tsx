'use client';

import React, { useState } from 'react';
import styles from '../components/Assignments/Assignments.module.css';
import EmptyState from '../components/Assignments/EmptyState';
import AssignmentCard from '../components/Assignments/AssignmentCard';
import { Filter, Search, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '../store/assignmentStore';

export default function AssignmentsPage() {
  const { assignments } = useAssignmentStore();
  const [search, setSearch] = useState('');
  const router = useRouter();

  if (assignments.length === 0) {
    return <EmptyState />;
  }

  const filtered = assignments.filter((a) =>
    `${a.subject} ${a.schoolName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className={styles.backgroundGlow}></div>
      <div className={styles.dashboardContainer}>
      {/* Dashboard Title / Header */}
      <div className={styles.headerSection}>
        <div className={styles.headerTitleBlock}>
          <div className={styles.headerDot}></div>
          <div className={styles.headerTextGroup}>
            <h1 className={styles.headerTitle}>Assignments</h1>
            <p className={styles.headerSubtitle}>Manage and create assignments for your classes.</p>
          </div>
        </div>
      </div>

      <div className={styles.mobileHeader}>
        <button onClick={() => router.push('/')} className={styles.mobileBackBtn}>
          <ArrowLeft size={20} />
        </button>
        <h1 className={styles.mobileTitle}>Assignments</h1>
        <div style={{ width: 40 }}></div>
      </div>

      {/* Actions Bar (Filter + Search) */}
      <div className={styles.actionsBar}>
        <div className={styles.filterBlock}>
          <div className={styles.filterContent}>
            <Filter size={20} color="#A9A9A9" />
            <span className={styles.filterText}>Filter By</span>
          </div>
        </div>

        <div className={styles.searchBlock}>
          <div className={styles.searchContent}>
            <Search size={20} color="#A9A9A9" />
            <input 
              type="text" 
              placeholder="Search Assignment" 
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className={styles.gridContainer}>
        {filtered.length > 0 ? (
          filtered.map(a => (
            <AssignmentCard 
              key={a._id} 
              assignment={a}
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '48px', width: '100%', color: '#A9A9A9', fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            No assignments match your search.
          </div>
        )}
      </div>

      <div className={styles.floatingCreateBtnWrapper}>
        <Link href="/assignments/create" className={styles.createBtn}>
          <Plus size={20} color="#FFFFFF" />
          <span>Create Assignment</span>
        </Link>
      </div>
    </div>
    </>
  );
}
