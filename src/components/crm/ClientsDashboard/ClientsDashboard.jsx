/**
 * ClientsDashboard Component - Simplified version for quick implementation
 */

import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllClients } from '../../../store/crmDataSlice';
import {
  selectSearchQuery,
  selectViewType,
  setSearchQuery,
  setView
} from '../../../store/managingDirectorDashboardSlice';
import { useDispatch } from 'react-redux';
import { Search, Grid3x3, List, Download } from 'lucide-react';
import {
  DashboardWrapper,
  DashboardHeader,
  DashboardTitle,
  DashboardSubtitle,
  ActionBtn,
  FiltersBar,
  SearchBox,
  ViewToggle,
  ViewBtn,
  ClientsGrid,
  ClientCard,
  ClientAvatar,
  ClientName,
  ClientType,
  ClientValue,
  ClientStats,
  ViewBtnSmall,
  ClientsTableWrapper,
  ClientsTable
} from './ClientsDashboard.styles';

const ClientsDashboard = () => {
  const dispatch = useDispatch();
  const clients = useSelector(selectAllClients);
  const searchQuery = useSelector(selectSearchQuery);
  const viewType = useSelector(selectViewType);

  const filteredClients = useMemo(
    () =>
      clients.filter(
        c =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [clients, searchQuery]
  );

  return (
    <DashboardWrapper>
      <DashboardHeader>
        <div>
          <DashboardTitle>👥 Active Clients</DashboardTitle>
          <DashboardSubtitle>{filteredClients.length} clients managed</DashboardSubtitle>
        </div>
        <ActionBtn $color="var(--color-green-600, #16a34a)">
          <Download size={18} /> Export
        </ActionBtn>
      </DashboardHeader>

      <FiltersBar>
        <SearchBox>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={e => dispatch(setSearchQuery(e.target.value))}
          />
        </SearchBox>
        <ViewToggle>
          <ViewBtn
            $active={viewType === 'grid'}
            onClick={() => dispatch(setView('grid'))}
          >
            <Grid3x3 size={18} />
          </ViewBtn>
          <ViewBtn
            $active={viewType === 'list'}
            onClick={() => dispatch(setView('list'))}
          >
            <List size={18} />
          </ViewBtn>
        </ViewToggle>
      </FiltersBar>

      {viewType === 'grid' ? (
        <ClientsGrid>
          {filteredClients.map(client => (
            <ClientCard key={client.id}>
              <ClientAvatar
                style={{ backgroundColor: client.avatar_color }}
              ></ClientAvatar>
              <ClientName>{client.name}</ClientName>
              <ClientType>{client.type}</ClientType>
              <ClientValue>AED {(client.total_value / 1000000).toFixed(1)}M</ClientValue>
              <ClientStats>
                <span>{client.properties_owned} Properties</span>
                <span>{client.deals_count} Deals</span>
              </ClientStats>
              <ViewBtnSmall>View Details</ViewBtnSmall>
            </ClientCard>
          ))}
        </ClientsGrid>
      ) : (
        <ClientsTableWrapper>
          <ClientsTable>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Type</th>
                <th>Total Value</th>
                <th>Properties</th>
                <th>Deals</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.type}</td>
                  <td>AED {(client.total_value / 1000000).toFixed(1)}M</td>
                  <td>{client.properties_owned}</td>
                  <td>{client.deals_count}</td>
                  <td>
                    <span className={`status-badge ${client.status}`}>
                      {client.status.toUpperCase()}
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

export default ClientsDashboard;
