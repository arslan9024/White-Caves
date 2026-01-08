import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FolderOpen, Grid, List } from 'lucide-react';
import { 
  selectUniqueClusters, 
  selectSheetsMeta,
  selectFilteredProperties,
  setFilter 
} from '../../../store/slices/inventorySlice';
import './ClusterBrowser.css';

const ClusterBrowser = ({ selectedCluster, onClusterSelect }) => {
  const dispatch = useDispatch();
  const clusters = useSelector(selectUniqueClusters);
  const sheets = useSelector(selectSheetsMeta);
  const properties = useSelector(selectFilteredProperties);

  const clusterCounts = clusters.reduce((acc, cluster) => {
    acc[cluster] = properties.filter(p => p.cluster === cluster).length;
    return acc;
  }, {});

  const handleClusterClick = (cluster) => {
    const newCluster = cluster === selectedCluster ? 'all' : cluster;
    dispatch(setFilter({ key: 'cluster', value: newCluster }));
    onClusterSelect?.(newCluster);
  };

  const validClusters = clusters.filter(c => c && c !== '.');

  return (
    <div className="cluster-browser">
      <div className="cluster-header">
        <FolderOpen size={18} />
        <h3>Clusters / Projects</h3>
        <span className="cluster-count">{validClusters.length} clusters</span>
      </div>
      <div className="cluster-grid">
        <button
          className={`cluster-chip ${selectedCluster === 'all' ? 'active' : ''}`}
          onClick={() => handleClusterClick('all')}
        >
          All ({properties.length.toLocaleString()})
        </button>
        {validClusters.map(cluster => (
          <button
            key={cluster}
            className={`cluster-chip ${selectedCluster === cluster ? 'active' : ''}`}
            onClick={() => handleClusterClick(cluster)}
          >
            {cluster} ({clusterCounts[cluster] || 0})
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClusterBrowser;
