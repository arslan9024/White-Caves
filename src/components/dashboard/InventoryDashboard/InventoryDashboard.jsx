import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AreaSummaryCard from './AreaSummaryCard';
import PropertyCard from './PropertyCard';
import PropertyListItem from './PropertyListItem';
import './InventoryDashboard.css';

const InventoryDashboard = () => {
  const dispatch = useDispatch();
  
  // State
  const [areaSummaries, setAreaSummaries] = useState([]);
  const [expandedAreas, setExpandedAreas] = useState([]);
  const [areaProperties, setAreaProperties] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [areaLoadingState, setAreaLoadingState] = useState({});

  // Fetch area summaries on mount
  useEffect(() => {
    loadAreaSummaries();
    loadDashboardStats();

    // Set up 5-second polling
    const pollInterval = setInterval(() => {
      loadDashboardStats();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  // Poll expanded areas every 5 seconds
  useEffect(() => {
    if (expandedAreas.length === 0) return;

    const pollInterval = setInterval(() => {
      expandedAreas.forEach((area) => {
        loadAreaProperties(area, 1);
      });
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [expandedAreas]);

  const loadAreaSummaries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/property-inventory/dashboard/areas-summary');
      const data = await response.json();
      if (data.success) {
        setAreaSummaries(data.data);
      }
    } catch (error) {
      console.error('Error loading area summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const response = await fetch('/api/property-inventory/dashboard/stats');
      const data = await response.json();
      if (data.success) {
        setDashboardStats(data.data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const loadAreaProperties = async (area, page = 1) => {
    try {
      setAreaLoadingState((prev) => ({ ...prev, [area]: true }));
      const response = await fetch(
        \/api/property-inventory/dashboard/properties-by-area/\?page=\&limit=10\
      );
      const data = await response.json();
      if (data.success) {
        setAreaProperties((prev) => ({
          ...prev,
          [area]: data.data,
        }));
      }
    } catch (error) {
      console.error(\Error loading properties for \:\, error);
    } finally {
      setAreaLoadingState((prev) => ({ ...prev, [area]: false }));
    }
  };

  const handleToggleArea = (area) => {
    if (expandedAreas.includes(area)) {
      setExpandedAreas(expandedAreas.filter((a) => a !== area));
      setAreaProperties((prev) => {
        const newProps = { ...prev };
        delete newProps[area];
        return newProps;
      });
    } else {
      setExpandedAreas([...expandedAreas, area]);
      loadAreaProperties(area, 1);
    }
  };

  const handleViewDetails = (property) => {
    console.log('View details:', property);
    // TODO: Open property details modal
  };

  const handleCreateOffer = (property) => {
    console.log('Create offer:', property);
    // TODO: Open create offer modal
  };

  const handleAssignAgent = (property) => {
    console.log('Assign agent:', property);
    // TODO: Open assign agent modal
  };

  const handleRefresh = () => {
    loadAreaSummaries();
    loadDashboardStats();
    expandedAreas.forEach((area) => {
      loadAreaProperties(area, 1);
    });
  };

  return (
    <div className='inventory-dashboard'>
      {/* Header */}
      <div className='dashboard-header'>
        <h1>Property Inventory Dashboard</h1>
        <div className='header-controls'>
          <div className='view-toggle'>
            <button
              className={\	oggle-btn \\}
              onClick={() => setViewMode('grid')}
              title='Grid View'
            >
               Grid
            </button>
            <button
              className={\	oggle-btn \\}
              onClick={() => setViewMode('list')}
              title='List View'
            >
               List
            </button>
          </div>
          <button className='refresh-btn' onClick={handleRefresh} title='Refresh'>
             Refresh
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboardStats && (
        <div className='dashboard-stats'>
          <div className='stat-card'>
            <div className='stat-value'>{dashboardStats.totalProperties}</div>
            <div className='stat-label'>Total Properties</div>
          </div>
          <div className='stat-card'>
            <div className='stat-value'>{dashboardStats.availabilityRate.toFixed(1)}%</div>
            <div className='stat-label'>Availability Rate</div>
          </div>
          <div className='stat-card'>
            <div className='stat-value'>{dashboardStats.occupancyRate.toFixed(1)}%</div>
            <div className='stat-label'>Occupancy Rate</div>
          </div>
          <div className='stat-card'>
            <div className='stat-value'>{dashboardStats.maryVisibleCount}</div>
            <div className='stat-label'>Mary Visible</div>
          </div>
          <div className='stat-card'>
            <div className='stat-value'>{dashboardStats.agentAssignmentCount}</div>
            <div className='stat-label'>With Agents</div>
          </div>
        </div>
      )}

      {/* Areas Container */}
      <div className='areas-container'>
        {loading ? (
          <div className='loading-spinner'>
            <div className='spinner' />
            <span>Loading areas...</span>
          </div>
        ) : (
          areaSummaries.map((areaSummary) => (
            <div key={areaSummary._id}>
              <AreaSummaryCard
                area={areaSummary._id}
                total={areaSummary.total}
                available={areaSummary.available}
                rented={areaSummary.rented}
                sold={areaSummary.sold}
                availabilityRate={areaSummary.availabilityRate}
                isExpanded={expandedAreas.includes(areaSummary._id)}
                isLoading={areaLoadingState[areaSummary._id]}
                onToggleExpand={() => handleToggleArea(areaSummary._id)}
              />

              {expandedAreas.includes(areaSummary._id) && (
                <div className={properties-container properties-\}>
                  {viewMode === 'grid' ? (
                    <div className='properties-grid'>
                      {areaProperties[areaSummary._id]?.map((prop) => (
                        <PropertyCard
                          key={prop._id}
                          property={prop}
                          inventory={prop.inventory}
                          onViewDetails={handleViewDetails}
                          onCreateOffer={handleCreateOffer}
                          onAssignAgent={handleAssignAgent}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className='properties-list'>
                      {areaProperties[areaSummary._id]?.map((prop) => (
                        <PropertyListItem
                          key={prop._id}
                          property={prop}
                          inventory={prop.inventory}
                          onViewDetails={handleViewDetails}
                          onCreateOffer={handleCreateOffer}
                          onAssignAgent={handleAssignAgent}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryDashboard;
