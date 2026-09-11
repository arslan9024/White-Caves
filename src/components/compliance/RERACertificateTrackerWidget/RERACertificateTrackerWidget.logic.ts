import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

interface Broker {
  id: string;
  name: string;
  brn: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expiring' | 'expired';
}

const MOCK_BROKERS: Broker[] = [
  { id: '1', name: 'Ahmed Al Mansoori', brn: 'BRN-49281', issueDate: '2025-06-15', expiryDate: '2026-06-15', status: 'active' },
  { id: '2', name: 'Sarah O\'Connor', brn: 'BRN-51029', issueDate: '2025-09-01', expiryDate: '2026-09-01', status: 'active' },
  { id: '3', name: 'Khalid Abdullah', brn: 'BRN-38472', issueDate: '2025-09-20', expiryDate: '2026-09-20', status: 'expiring' },
  { id: '4', name: 'Elena Rostova', brn: 'BRN-55912', issueDate: '2025-08-10', expiryDate: '2026-08-10', status: 'expired' },
  { id: '5', name: 'Mohammed Tariq', brn: 'BRN-42111', issueDate: '2026-01-10', expiryDate: '2027-01-10', status: 'active' },
];

export const useRERACertificateTrackerLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');

  const filteredBrokers = MOCK_BROKERS.filter(broker => {
    const matchesSearch = broker.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          broker.brn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || broker.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: 108, // Hardcoded as per requirement "All 108 Staff Members"
    active: 95,
    actionNeeded: 13 // 10 expiring, 3 expired
  };

  const handleRenew = (brn: string) => {
    window.alert(`Redirecting to DLD/Trakheesi portal to renew BRN: ${brn}`);
  };

  return {
    t,
    isRtl,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    filteredBrokers,
    stats,
    handleRenew
  };
};
