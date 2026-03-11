import React, { FC, ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import {
  EmptyContainer,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  EmptyAction,
  EmptyContent,
} from './Empty.styles';

interface EmptyProps {
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  fullHeight?: boolean;
}

export const Empty: FC<EmptyProps> = ({
  icon,
  title = 'No data',
  description = 'There is nothing to display',
  action,
  children,
  className = '',
  style,
  fullHeight = false,
}) => {
  return (
    <EmptyContainer $fullHeight={fullHeight} className={className} style={style}>
      <EmptyContent>
        {icon ? (
          <EmptyIcon>{icon}</EmptyIcon>
        ) : (
          <EmptyIcon>
            <Inbox size={48} strokeWidth={1.5} />
          </EmptyIcon>
        )}
        {title && <EmptyTitle>{title}</EmptyTitle>}
        {description && <EmptyDescription>{description}</EmptyDescription>}
        {(action || children) && (
          <EmptyAction>{action || children}</EmptyAction>
        )}
      </EmptyContent>
    </EmptyContainer>
  );
};

interface EmptyListProps {
  itemCount?: number;
  isLoading?: boolean;
  children?: ReactNode;
  emptyText?: string;
  emptyIcon?: ReactNode;
  emptyAction?: ReactNode;
  renderEmpty?: () => ReactNode;
}

export const EmptyList: FC<EmptyListProps> = ({
  itemCount = 0,
  isLoading = false,
  children,
  emptyText = 'No items found',
  emptyIcon,
  emptyAction,
  renderEmpty,
}) => {
  if (isLoading) {
    return null;
  }

  if (itemCount === 0) {
    if (renderEmpty) {
      return <>{renderEmpty()}</>;
    }

    return (
      <Empty
        icon={emptyIcon}
        title={emptyText}
        action={emptyAction}
      />
    );
  }

  return <>{children}</>;
};

export default Empty;
