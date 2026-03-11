/**
 * AgentsDashboard Component - Simplified version
 */

import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllAgents, updateAgent } from '../../../store/crmDataSlice';
import {
  selectSearchQuery,
  selectViewType,
  setSearchQuery,
  setView
} from '../../../store/managingDirectorDashboardSlice';
import { Search, Grid3x3, List, Download } from 'lucide-react';
import {
  AgentsDashboardWrapper,
  AgentsDashboardHeader,
  AgentsDashboardTitle,
  AgentsDashboardSubtitle,
  AgentsActionBtn,
  AgentsFiltersBar,
  AgentsSearchBox,
  AgentsViewToggle,
  AgentsViewBtn,
  AgentsGrid,
  AgentCard,
  AgentAvatar,
  AgentName,
  AgentDepartment,
  AgentStats,
  Stat,
  StatValue,
  StatLabel,
  AgentCommission,
  AgentStatus,
  AgentsTableWrapper,
  AgentsTable
} from './AgentsDashboard.styles';

const AgentsDashboard = () => {
  const dispatch = useDispatch();
  const agents = useSelector(selectAllAgents);
  const searchQuery = useSelector(selectSearchQuery);
  const viewType = useSelector(selectViewType);

  const filteredAgents = useMemo(
    () =>
      agents.filter(
        a =>
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [agents, searchQuery]
  );

  return (
    <AgentsDashboardWrapper>
      <AgentsDashboardHeader>
        <div>
          <AgentsDashboardTitle>👨‍💼 Sales Team Performance</AgentsDashboardTitle>
          <AgentsDashboardSubtitle>{agents.length} agents total</AgentsDashboardSubtitle>
        </div>
        <AgentsActionBtn>
          <Download size={18} /> Export
        </AgentsActionBtn>
      </AgentsDashboardHeader>

      <AgentsFiltersBar>
        <AgentsSearchBox>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={e => dispatch(setSearchQuery(e.target.value))}
          />
        </AgentsSearchBox>
        <AgentsViewToggle>
          <AgentsViewBtn
            $active={viewType === 'grid'}
            onClick={() => dispatch(setView('grid'))}
          >
            <Grid3x3 size={18} />
          </AgentsViewBtn>
          <AgentsViewBtn
            $active={viewType === 'list'}
            onClick={() => dispatch(setView('list'))}
          >
            <List size={18} />
          </AgentsViewBtn>
        </AgentsViewToggle>
      </AgentsFiltersBar>

      {viewType === 'grid' ? (
        <AgentsGrid>
          {filteredAgents.map(agent => (
            <AgentCard key={agent.id}>
              <AgentAvatar
                style={{ backgroundColor: agent.avatar_color }}
              >
                {agent.avatar}
              </AgentAvatar>
              <AgentName>{agent.name}</AgentName>
              <AgentDepartment>{agent.department}</AgentDepartment>
              <AgentStats>
                <Stat>
                  <StatValue>{agent.sales}</StatValue>
                  <StatLabel>Sales</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{agent.rating}</StatValue>
                  <StatLabel>Rating</StatLabel>
                </Stat>
              </AgentStats>
              <AgentCommission>
                AED {(agent.commission / 1000).toFixed(0)}K
              </AgentCommission>
              <AgentStatus $status={agent.status}>
                {agent.status === 'online' ? '🟢' : '⚪'} {agent.status.toUpperCase()}
              </AgentStatus>
            </AgentCard>
          ))}
        </AgentsGrid>
      ) : (
        <AgentsTableWrapper>
          <AgentsTable>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Department</th>
                <th>Sales</th>
                <th>Commission</th>
                <th>Rating</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map(agent => (
                <tr key={agent.id}>
                  <td>{agent.name}</td>
                  <td>{agent.department}</td>
                  <td>{agent.sales}</td>
                  <td>AED {(agent.commission / 1000).toFixed(0)}K</td>
                  <td>⭐ {agent.rating}</td>
                  <td>
                    <span className={`agent-status-badge ${agent.status}`}>
                      {agent.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentsDashboard;
