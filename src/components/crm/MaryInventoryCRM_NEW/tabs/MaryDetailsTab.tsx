import React, { useState, useMemo } from 'react';
import { FileText, Grid3x3, BookOpen, AlertCircle } from 'lucide-react';
import { useInventoryData } from '../hooks/useInventoryData';
import {
  MaryDetailsTabContainer,
  TabHeader,
  HeaderContent,
  HeaderSubtitle,
  DetailsViewTabs,
  ViewTab,
  DetailsViewContent,
  GuideSection,
  InfoCard,
  GuideContent,
  GuideList,
  SelectedPropertySection,
  PropertyDetails,
  DetailGroup,
  StatusBadge,
  OwnersList,
  EmptyState,
  MatrixSection,
  MatrixInfo,
  ClustersContainer,
  ClusterBlock,
  ClusterTitle,
  PropertiesGrid,
  PropertyCard,
  CardHeader,
  PNumber,
  CardBody,
  CardFooter,
  EmptyMatrix
} from './MaryDetailsTab.styles';

interface InventoryProperty {
  pNumber: string;
  project?: string;
  cluster?: string;
  area?: string;
  building?: string;
  unitNumber?: string;
  floor?: string | number;
  status?: string;
  owners?: string[];
  [key: string]: unknown;
}

interface DetailsView {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string }>;
}

/**
 * MaryDetailsTab - Property details view and documentation
 * Shows selected property details, property matrix, and guides
 */
export default function MaryDetailsTab() {
  const { properties = [] } = useInventoryData();
  const [activeDetailsView, setActiveDetailsView] = useState<string>('guide');
  const [selectedProperty, setSelectedProperty] = useState<InventoryProperty | null>(null);

  // Get property matrix data
  const propertyMatrix = useMemo(() => {
    const matrix: Record<string, InventoryProperty[]> = {};
    if (Array.isArray(properties)) {
      properties.forEach((prop: InventoryProperty) => {
        const key = prop.cluster || 'Unknown';
        if (!matrix[key]) {
          matrix[key] = [];
        }
        matrix[key].push(prop);
      });
    }
    return matrix;
  }, [properties]);

  const detailsViews: DetailsView[] = [
    { id: 'guide', label: 'Getting Started', icon: BookOpen },
    { id: 'selected', label: 'Selected Property', icon: FileText },
    { id: 'matrix', label: 'Property Matrix', icon: Grid3x3 }
  ];

  return (
    <MaryDetailsTabContainer>
      {/* Tab Header */}
      <TabHeader>
        <HeaderContent>
          <h3>Property Details</h3>
          <HeaderSubtitle>
            View detailed information about properties in your inventory
          </HeaderSubtitle>
        </HeaderContent>
      </TabHeader>

      {/* View Selector */}
      <DetailsViewTabs>
        {detailsViews.map(view => {
          const IconComponent = view.icon;
          return (
            <ViewTab
              key={view.id}
              $isActive={activeDetailsView === view.id}
              onClick={() => setActiveDetailsView(view.id)}
              type="button"
            >
              <IconComponent size={16} />
              {view.label}
            </ViewTab>
          );
        })}
      </DetailsViewTabs>

      {/* View Content */}
      <DetailsViewContent>
        {/* Getting Started Guide */}
        {activeDetailsView === 'guide' && (
          <GuideSection>
            <InfoCard>
              <AlertCircle size={20} />
              <div>
                <h4>How to View Property Details</h4>
                <p>
                  Property details are typically shown in a modal when you click on a property in
                  the Inventory tab. You can also select properties here to preview their
                  information.
                </p>
              </div>
            </InfoCard>

            <GuideContent>
              <h4>Available Information:</h4>
              <GuideList>
                <li>
                  <strong>Property Number (P-Number)</strong> - Unique property identifier
                </li>
                <li>
                  <strong>Project & Cluster</strong> - Location grouping and classification
                </li>
                <li>
                  <strong>Area & Building</strong> - Specific location details
                </li>
                <li>
                  <strong>Unit & Floor</strong> - Unit number and floor level
                </li>
                <li>
                  <strong>Status</strong> - Current property status (Active, Inactive, Sold, etc.)
                </li>
                <li>
                  <strong>Owners</strong> - Names and contact information of property owners
                </li>
                <li>
                  <strong>Multi-Owner Details</strong> - Ownership percentage and relations for
                  shared properties
                </li>
              </GuideList>

              <h4 className="mt-6">Tips:</h4>
              <GuideList>
                <li>Use filters in the Inventory tab to narrow down properties</li>
                <li>Search by property number, project, or cluster name</li>
                <li>Click on property cards to open detailed modal view</li>
                <li>Use Data Tools tab to export or validate property information</li>
              </GuideList>
            </GuideContent>
          </GuideSection>
        )}

        {/* Selected Property Details */}
        {activeDetailsView === 'selected' && (
          <SelectedPropertySection>
            {selectedProperty ? (
              <PropertyDetails>
                <DetailGroup>
                  <label>Property Number</label>
                  <div>{selectedProperty.pNumber}</div>
                </DetailGroup>
                <DetailGroup>
                  <label>Project</label>
                  <div>{selectedProperty.project}</div>
                </DetailGroup>
                <DetailGroup>
                  <label>Cluster</label>
                  <div>{selectedProperty.cluster}</div>
                </DetailGroup>
                <DetailGroup>
                  <label>Area</label>
                  <div>{selectedProperty.area}</div>
                </DetailGroup>
                <DetailGroup>
                  <label>Building</label>
                  <div>{selectedProperty.building || 'N/A'}</div>
                </DetailGroup>
                <DetailGroup>
                  <label>Unit & Floor</label>
                  <div>
                    {selectedProperty.unitNumber
                      ? `${selectedProperty.unitNumber} - Floor ${selectedProperty.floor || 'N/A'}`
                      : 'N/A'}
                  </div>
                </DetailGroup>
                <DetailGroup>
                  <label>Status</label>
                  <StatusBadge>{selectedProperty.status}</StatusBadge>
                </DetailGroup>
                <DetailGroup>
                  <label>Owners ({selectedProperty.owners?.length || 0})</label>
                  <OwnersList>
                    {selectedProperty.owners && selectedProperty.owners.length > 0 ? (
                      selectedProperty.owners.map((ownerId) => <li key={ownerId}>{ownerId}</li>)
                    ) : (
                      <li>No owners assigned</li>
                    )}
                  </OwnersList>
                </DetailGroup>
              </PropertyDetails>
            ) : (
              <EmptyState>
                <FileText size={40} />
                <h4>No Property Selected</h4>
                <p>
                  Switch to the "Property Matrix" tab to select a property, or click on properties
                  in the Inventory tab.
                </p>
              </EmptyState>
            )}
          </SelectedPropertySection>
        )}

        {/* Property Matrix */}
        {activeDetailsView === 'matrix' && (
          <MatrixSection>
            <MatrixInfo>
              <p>Click on any property card below to view its details:</p>
            </MatrixInfo>

            <ClustersContainer>
              {Object.entries(propertyMatrix).map(([cluster, clusterProps]) => (
                <ClusterBlock key={cluster}>
                  <ClusterTitle>
                    {cluster || 'Unassigned'} ({clusterProps.length})
                  </ClusterTitle>
                  <PropertiesGrid>
                    {clusterProps.map(prop => (
                      <PropertyCard
                        key={prop.pNumber}
                        $isSelected={selectedProperty?.pNumber === prop.pNumber}
                        onClick={() => setSelectedProperty(prop)}
                        role="button"
                        tabIndex={0}
                      >
                        <CardHeader>
                          <PNumber>{prop.pNumber}</PNumber>
                          <StatusBadge>{prop.status}</StatusBadge>
                        </CardHeader>
                        <CardBody>
                          <p className="card-project">{prop.project}</p>
                          <p className="card-area">{prop.area}</p>
                          {prop.unitNumber && <p className="card-unit">Unit {prop.unitNumber}</p>}
                        </CardBody>
                        <CardFooter>
                          <span className="owner-count">
                            {prop.owners?.length || 0} owner(s)
                          </span>
                        </CardFooter>
                      </PropertyCard>
                    ))}
                  </PropertiesGrid>
                </ClusterBlock>
              ))}

              {Object.keys(propertyMatrix).length === 0 && (
                <EmptyMatrix>
                  <p>No properties to display</p>
                </EmptyMatrix>
              )}
            </ClustersContainer>
          </MatrixSection>
        )}
      </DetailsViewContent>
    </MaryDetailsTabContainer>
  );
}
