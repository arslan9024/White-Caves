import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FolderOpen } from 'lucide-react';
import { 
  selectUniqueClusters, 
  selectSheetsMeta,
  selectFilteredProperties,
  setFilter 
} from '../../../store/slices/inventorySlice';
import {
  ClusterBrowserContainer,
  ClusterHeader,
  ClusterTitle,
  ClusterCount,
  ClusterGrid,
  ClusterChip
} from './ClusterBrowser.styles';

interface ClusterBrowserProps {
  selectedCluster: string;
  onClusterSelect?: (cluster: string) => void;
}

const ClusterBrowser = ({ selectedCluster, onClusterSelect }: ClusterBrowserProps) => {
  const dispatch = useDispatch();
  const clusters = useSelector(selectUniqueClusters);
  const sheets = useSelector(selectSheetsMeta);
  const properties = useSelector(selectFilteredProperties);

  const clusterCounts = clusters.reduce<Record<string, number>>((acc, cluster) => {
    acc[cluster] = properties.filter(p => p.cluster === cluster).length;
    return acc;
  }, {});

  const handleClusterClick = (cluster: string) => {
    const newCluster = cluster === selectedCluster ? 'all' : cluster;
    dispatch(setFilter({ key: 'cluster', value: newCluster }));
    onClusterSelect?.(newCluster);
  };

  const validClusters = clusters.filter(c => c && c !== '.');

  return (
    <ClusterBrowserContainer>
      <ClusterHeader>
        <FolderOpen size={18} />
        <ClusterTitle>Clusters / Projects</ClusterTitle>
        <ClusterCount>{validClusters.length} clusters</ClusterCount>
      </ClusterHeader>
      <ClusterGrid>
        <ClusterChip
          $active={selectedCluster === 'all'}
          onClick={() => handleClusterClick('all')}
        >
          All ({properties.length.toLocaleString()})
        </ClusterChip>
        {validClusters.map(cluster => (
          <ClusterChip
            key={cluster}
            $active={selectedCluster === cluster}
            onClick={() => handleClusterClick(cluster)}
          >
            {cluster} ({clusterCounts[cluster] || 0})
          </ClusterChip>
        ))}
      </ClusterGrid>
    </ClusterBrowserContainer>
  );
};

export default ClusterBrowser;
