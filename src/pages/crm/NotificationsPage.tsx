/**
 * CRM Notifications Page
 * Notification center with mark read, filters, and delete.
 * Business logic extracted to useNotifications hook.
 * Shared styles imported from CrmPageStyles.
 * Route: /owner/crm/notifications
 */

import React, { FC } from 'react';
import styled from 'styled-components';
import { Badge, Pagination } from '../../components/ui';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  BackLink,
  ActionBar,
  FilterSelect,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  EmptyState,
  PaginationWrapper,
  LoadingBanner,
  ErrorBanner,
} from './styles/CrmPageStyles';
import { useNotifications, TYPE_CONFIG } from './hooks/useNotifications';
import type { Notification } from './hooks/useNotifications';

// ─── Notifications-Specific Styled Components ───────────────────────────

const UnreadBadge = styled.span`
  background: #c9a84c;
  color: #0f0f0f;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  margin-left: 0.5rem;
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NotificationItem = styled.div<{ $unread: boolean }>`
  background: ${props => (props.$unread ? '#1a1a1a' : '#0f0f0f')};
  border: 1px solid ${props => (props.$unread ? 'rgba(201, 168, 76, 0.5)' : '#2c2c2c')};
  border-radius: 10px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.15s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 2px 12px rgba(201, 168, 76, 0.12);
    border-color: rgba(201, 168, 76, 0.4);
  }
`;

const NotificationIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f1f1f;
  border-radius: 10px;
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.div<{ $unread: boolean }>`
  font-size: 0.9rem;
  font-weight: ${props => (props.$unread ? 600 : 400)};
  color: ${props => (props.$unread ? '#ffffff' : 'rgba(255, 255, 255, 0.7)')};
  margin-bottom: 0.25rem;
`;

const NotificationMessage = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.4;
`;

const NotificationMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.4rem;
`;

const TimeAgo = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
  align-items: center;
`;

// ─── Component ──────────────────────────────────────────────────────────

const NotificationsPage: FC = () => {
  useDocumentTitle('Notifications');
  const {
    filteredNotifications,
    paginatedNotifications,
    unreadCount,
    loading,
    error,
    typeFilter,
    readFilter,
    currentPage,
    ITEMS_PER_PAGE,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    handleTypeFilterChange,
    handleReadFilterChange,
    setCurrentPage,
    retryFetch,
    goBack,
    getTimeAgo,
  } = useNotifications();

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader>
        <div>
          <BackLink onClick={goBack}>← Back to CRM Hub</BackLink>
          <PageTitle>
            🔔 Notifications
            {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
          </PageTitle>
        </div>
        {unreadCount > 0 && (
          <PrimaryButton onClick={handleMarkAllAsRead}>✓ Mark All as Read</PrimaryButton>
        )}
      </PageHeader>

      {/* Loading & Error States */}
      {loading && <LoadingBanner>⏳ Loading notifications...</LoadingBanner>}
      {error && (
        <ErrorBanner>
          <span>⚠️ {error}</span>
          <SecondaryButton onClick={retryFetch}>Retry</SecondaryButton>
        </ErrorBanner>
      )}

      {/* Filters */}
      <ActionBar>
        <FilterSelect value={typeFilter} onChange={e => handleTypeFilterChange(e.target.value)}>
          <option value="all">All Types</option>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>
              {cfg.icon} {cfg.label}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          value={readFilter}
          onChange={e => handleReadFilterChange(e.target.value as 'all' | 'unread' | 'read')}
        >
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </FilterSelect>
        <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
          {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
        </span>
      </ActionBar>

      {/* Notification List */}
      {paginatedNotifications.length > 0 ? (
        <NotificationList>
          {paginatedNotifications.map((notif: Notification) => (
            <NotificationItem
              key={notif.id}
              $unread={!notif.read}
              onClick={() => !notif.read && handleMarkAsRead(notif.id)}
            >
              <NotificationIcon>{TYPE_CONFIG[notif.type || '']?.icon || 'ℹ️'}</NotificationIcon>
              <NotificationContent>
                <NotificationTitle $unread={!notif.read}>
                  {notif.title || 'Notification'}
                </NotificationTitle>
                <NotificationMessage>{notif.message || 'No details available'}</NotificationMessage>
                <NotificationMeta>
                  <TimeAgo>{getTimeAgo(notif.created_at)}</TimeAgo>
                  <Badge
                    variant={TYPE_CONFIG[notif.type || '']?.badgeVariant || 'secondary'}
                    size="small"
                  >
                    {TYPE_CONFIG[notif.type || '']?.label || notif.type || 'Info'}
                  </Badge>
                </NotificationMeta>
              </NotificationContent>
              <NotificationActions>
                {!notif.read && (
                  <SecondaryButton
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleMarkAsRead(notif.id);
                    }}
                  >
                    ✓ Read
                  </SecondaryButton>
                )}
                <DangerButton
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleDelete(notif.id);
                  }}
                >
                  ✕
                </DangerButton>
              </NotificationActions>
            </NotificationItem>
          ))}
        </NotificationList>
      ) : (
        <EmptyState>
          {typeFilter !== 'all' || readFilter !== 'all'
            ? 'No notifications match your filters'
            : "No notifications yet — you're all caught up!"}
        </EmptyState>
      )}

      {/* Pagination */}
      {filteredNotifications.length > ITEMS_PER_PAGE && (
        <PaginationWrapper>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredNotifications.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </PaginationWrapper>
      )}
    </PageContainer>
  );
};

export default NotificationsPage;
