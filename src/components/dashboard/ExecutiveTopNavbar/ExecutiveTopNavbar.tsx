import React, { FC } from 'react';
import { TopNavbar, TopNavbarProps } from '../../TopNavbar/TopNavbar';

export interface ExecutiveTopNavbarProps extends TopNavbarProps {}

export const ExecutiveTopNavbar: FC<ExecutiveTopNavbarProps> = props => {
  return <TopNavbar sticky={true} {...props} />;
};

export default ExecutiveTopNavbar;
