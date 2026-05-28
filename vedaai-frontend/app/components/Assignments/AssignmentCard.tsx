'use client';

import React, { useState } from 'react';
import styles from './Assignments.module.css';
import { MoreVertical } from 'lucide-react';
import { useAssignmentStore, AssignmentRecord } from '../../store/assignmentStore';
import { useRouter } from 'next/navigation';

interface AssignmentCardProps {
  assignment: AssignmentRecord;
}

export default function AssignmentCard({ assignment }: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { removeAssignment, setCurrentAssignmentId } = useAssignmentStore();
  const router = useRouter();

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit", month: "2-digit", year: "numeric",
    }).replace(/\//g, '-'); 
  };

  const assignedDate = formatDate(assignment.createdAt);
  const dueDate = assignment.dueDate ? formatDate(assignment.dueDate) : "—";
  
  // Use subject as main title, if missing use school name
  
  const title = assignment.subject || assignment.schoolName || "Assignment";

  return (
    <div className={styles.card}>
      {/* Top Section */}
      <div className={styles.cardTop}>
        <div className={styles.cardTitleBlock}>
          <h3 className={styles.cardTitle}>{title}</h3>
        </div>
        
        <div style={{ position: 'relative' }}>
          <button className={styles.moreBtn} onClick={() => setMenuOpen(!menuOpen)}>
            <MoreVertical size={24} color="#A9A9A9" />
          </button>
          
          {menuOpen && (
            <>
              <div 
                style={{ position: 'fixed', inset: 0, zIndex: 5 }} 
                onClick={() => setMenuOpen(false)} 
              />
              <div className={styles.dropdownMenu}>
                <button
                  className={`${styles.dropdownItem} ${styles.dropdownItemPrimary}`}
                  onClick={() => { 
                    setMenuOpen(false); 
                    setCurrentAssignmentId(assignment._id);
                    router.push('/assignments/output'); 
                  }}
                >
                  View Assignment
                </button>
                <button
                  className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                  onClick={() => { setMenuOpen(false); removeAssignment(assignment._id); }}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.cardBottom}>
        <div className={styles.cardDates}>
          <span className={styles.dateText}><b>Assigned on :</b> {assignedDate}</span>
          <span className={styles.dateText}><b>Due :</b> {dueDate}</span>
        </div>
      </div>
    </div>
  );
}
