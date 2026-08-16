import React from 'react';
import { useGovernanceDashboardLogic } from './GovernanceDashboard.logic';
import {
  Container,
  Title,
  Grid,
  Card,
  CardTitle,
  StatusBadge,
  DetailRow
} from './GovernanceDashboard.style';

export const GovernanceDashboard: React.FC = () => {
  const { statuses } = useGovernanceDashboardLogic();

  return (
    <Container>
      <Title>Governance & Credentials Pipeline</Title>
      <Grid>
        {statuses.map((license) => (
          <Card key={license.name} $status={license.status}>
            <CardTitle>
              {license.name} License
              <StatusBadge $status={license.status}>
                {license.status.replace('_', ' ')}
              </StatusBadge>
            </CardTitle>
            <DetailRow>
              <span>ID Number:</span>
              <strong>{license.idNumber}</strong>
            </DetailRow>
            <DetailRow>
              <span>Expiry Date:</span>
              <strong>{license.expiryDate}</strong>
            </DetailRow>
            <DetailRow>
              <span>Days Remaining:</span>
              <strong>{license.daysRemaining} days</strong>
            </DetailRow>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default GovernanceDashboard;
