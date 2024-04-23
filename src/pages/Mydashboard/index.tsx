import DashboardButton from '@/src/components/common/Button/DashboardButton';
import styles from './Mydashboard.module.scss';
import React, { useState, useEffect } from 'react';
import DashboardLinkButton, { dashboardData } from '@/src/components/common/Button/DashboardLinkButton';
import { fetchDashboards } from '@/src/apis/myDashboardService';
import PagenationButton from '@/src/components/common/Button/PagenationButton';
import TaskButton from '@/src/components/common/Button/TaskButton';
import { fetchInvitations } from '@/src/apis/invitationService';

interface Invitation {
  id: number;
  inviter: {
    nickname: string;
    email: string;
    id: number;
  };
  teamId: string;
  dashboard: {
    title: string;
    id: number;
  };
  invitee: {
    nickname: string;
    email: string;
    id: number;
  };
  inviteAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InvitationResponse {
  totalCount: number;
  invitations: Invitation[];
}

export default function Mydashboard() {
  const [dashboards, setDashboards] = useState<dashboardData[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // 나의 대시보드 목록 GET
  useEffect(() => {
    loadDashboardData(currentPage);
  }, [currentPage]);

  const loadDashboardData = async (page: number) => {
    const params = {
      teamId: '4-16',
      navigationMethod: 'pagination' as 'pagination' | 'infiniteScroll',
      page: page,
      size: 5,
    };
    const data = await fetchDashboards(params);
    setDashboards(data.dashboards);
    setTotalPages(Math.ceil(data.totalCount / params.size));
  };

  // 초대받은 목록 GET
  useEffect;

  const loadInvitationsData = async (page: number) => {
    const params: {
      teamId: '4-16';
      dashboardId;
      page: 1;
      size: 10;
    };
    const data = await fetchInvitations;
  };

  // 페이지네이션
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.menu}></div>
        <div className={styles.navbar}></div>
        <div className={styles.contentContainer}>
          <div className={styles.newDashboard}>
            <DashboardButton type="dashboardLarge">새로운 대시보드</DashboardButton>
            {dashboards.map(dashboard => (
              <DashboardLinkButton key={dashboard.id} dashboardData={dashboard} size="large" />
            ))}
          </div>
          <div className={styles.pagination}>
            <div className={styles.whereAmI}>
              {totalPages} 페이지 중 {currentPage}
            </div>
            <PagenationButton
              size="large"
              isDisabledLeft={currentPage <= 1}
              isDisabledRight={currentPage >= totalPages}
              onClickLeft={() => handlePageChange(currentPage - 1)}
              onClickRight={() => handlePageChange(currentPage + 1)}
            />
          </div>
          <div className={styles.invitedDashboard}>
            <div className={styles.invitedTitle}>초대받은 대시보드</div>
            <div>
              {/* {invitations.length > 0 ? (
                <div>
                  {invitations.map(invitation => (
                    <div>{invitation.dashboard.title}</div>
                  ))}
                </div>
              ) : (
                <div className={styles.noInvitedContainer}>
                  <img src="./unsubscribe.svg" className={styles.noInvitedImage}></img>
                  <div className={styles.noInvited}>아직 초대받은 대시보드가 없어요</div>
                </div>
              )} */}
              <div className={styles.yesInvitedContainer}>
                <input type="text" name="search" placeholder="검색" className={styles.invitedInput} />
                <img src="./search.svg" className={styles.searchIcon} />
                <div className={styles.invitedListContainer}>
                  <div className={styles.invitedListHeader}>
                    <div className={styles.invitedListColumn}>이름</div>
                    <div className={styles.invitedListColumn}>초대자</div>
                    <div className={styles.invitedListColumn}>수락여부</div>
                  </div>
                  {/* {invitations.map((invitation, index) => (
                    <div key={index} className={styles.invitedListItem}>
                      <div className={styles.invitedListColumn}>{invitation.dashboard.title}</div>
                      <div className={styles.invitedListColumn}>{invitation.inviter.nickname}</div>
                      <div className={styles.invitedListColumn}>
                        <button className={styles.acceptButton}>수락</button>
                        <button className={styles.rejectButton}>거절</button>
                      </div>
                    </div>
                  ))} */}
                  <div className={styles.invitedListItem}>
                    <div className={styles.invitedListColumn}>제목1</div>
                    <div className={styles.invitedListColumn}>백지원</div>
                    <div className={`${styles.invitedListColumn} ${styles.button}`}>
                      <TaskButton size="large" color="violet">
                        수락
                      </TaskButton>
                      <TaskButton size="large" color="white">
                        거절
                      </TaskButton>
                    </div>
                  </div>
                  <div className={styles.invitedListItem}>
                    <div className={styles.invitedListColumn}>제목1</div>
                    <div className={styles.invitedListColumn}>백지원</div>
                    <div className={`${styles.invitedListColumn} ${styles.button}`}>
                      <TaskButton size="large" color="violet">
                        수락
                      </TaskButton>
                      <TaskButton size="large" color="white">
                        거절
                      </TaskButton>
                    </div>
                    <div className={styles.line}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
