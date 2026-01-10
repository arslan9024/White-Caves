import { useState, useEffect, useCallback } from 'react';
import organizationApi from '../services/organizationApi';

export function useOrganizationData() {
  const [departments, setDepartments] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [teams, setTeams] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasData, setHasData] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [deptRes, asstRes, teamRes, svcRes, statsRes] = await Promise.all([
        organizationApi.getDepartments({ populate: true }),
        organizationApi.getAssistants(),
        organizationApi.getTeams(),
        organizationApi.getServices(),
        organizationApi.getStats()
      ]);
      
      setDepartments(deptRes.data || []);
      setAssistants(asstRes.data || []);
      setTeams(teamRes.data || []);
      setServices(svcRes.data || []);
      setStats(statsRes.data || null);
      setHasData((deptRes.data?.length || 0) > 0);
    } catch (err) {
      console.error('Error fetching organization data:', err);
      setError(err.message);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const seedDatabase = useCallback(async () => {
    setSeeding(true);
    setError(null);
    try {
      await organizationApi.seedDatabase();
      await fetchAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setSeeding(false);
    }
  }, [fetchAll]);

  const checkAndSeed = useCallback(async () => {
    try {
      const statusRes = await organizationApi.getSeedStatus();
      if (!statusRes.data?.hasData) {
        await seedDatabase();
      } else {
        await fetchAll();
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [fetchAll, seedDatabase]);

  useEffect(() => {
    checkAndSeed();
  }, []);

  const getAssistantsByDepartment = useCallback((deptId) => {
    return assistants.filter(a => 
      a.department?._id === deptId || a.department === deptId
    );
  }, [assistants]);

  const getServicesByCategory = useCallback((category) => {
    return services.filter(s => s.category === category);
  }, [services]);

  const getTeamsByDepartment = useCallback((deptId) => {
    return teams.filter(t => 
      t.department?._id === deptId || t.department === deptId
    );
  }, [teams]);

  return {
    departments,
    assistants,
    teams,
    services,
    stats,
    loading,
    error,
    hasData,
    seeding,
    refetch: fetchAll,
    seedDatabase,
    getAssistantsByDepartment,
    getServicesByCategory,
    getTeamsByDepartment
  };
}

export function useDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    organizationApi.getDepartments({ populate: true })
      .then(res => setDepartments(res.data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { departments, loading, error };
}

export function useAssistants(departmentId = null) {
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const options = departmentId ? { department: departmentId } : {};
    organizationApi.getAssistants(options)
      .then(res => setAssistants(res.data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [departmentId]);

  return { assistants, loading, error };
}

export function useServices(category = null) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const options = category ? { category } : {};
    organizationApi.getServices(options)
      .then(res => setServices(res.data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  return { services, loading, error };
}

export function useOrganizationStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    organizationApi.getStats()
      .then(res => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}

export default useOrganizationData;
