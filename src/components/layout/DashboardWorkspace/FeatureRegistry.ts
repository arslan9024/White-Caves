// src/components/layout/DashboardWorkspace/FeatureRegistry.ts
import React from 'react';

/**
 * Feature Registry for Dashboard Dynamic Content Rendering
 * Allows features to be registered and rendered dynamically based on sidebar selection
 */

export type FeatureComponentProps = {
  featureId: string;
  featureData?: any;
  isActive?: boolean;
  onClose?: () => void;
  [key: string]: any;
};

export interface Feature {
  id: string;
  name: string;
  icon?: React.ReactNode;
  label: string;
  description?: string;
  category: 'crm' | 'inventory' | 'analytics' | 'whatsapp' | 'admin' | 'tools' | 'other';
  component: React.ComponentType<FeatureComponentProps>;
  lazyComponent?: () => Promise<any>;
  permissions?: string[];
  disabled?: boolean;
  badge?: string;
  metadata?: Record<string, any>;
}

class FeatureRegistry {
  private features: Map<string, Feature> = new Map();
  private categories: Set<string> = new Set();
  private listeners: Set<(features: Map<string, Feature>) => void> = new Set();

  /**
   * Register a feature
   */
  registerFeature(feature: Feature): void {
    if (this.features.has(feature.id)) {
      console.warn(`Feature "${feature.id}" is already registered`);
      return;
    }

    this.features.set(feature.id, feature);
    this.categories.add(feature.category);
    this.notifyListeners();
  }

  /**
   * Register multiple features
   */
  registerFeatures(features: Feature[]): void {
    features.forEach(feature => this.registerFeature(feature));
  }

  /**
   * Unregister a feature
   */
  unregisterFeature(featureId: string): void {
    this.features.delete(featureId);
    this.notifyListeners();
  }

  /**
   * Get a feature by ID
   */
  getFeature(featureId: string): Feature | undefined {
    return this.features.get(featureId);
  }

  /**
   * Get all features
   */
  getAllFeatures(): Feature[] {
    return Array.from(this.features.values());
  }

  /**
   * Get features by category
   */
  getFeaturesByCategory(category: string): Feature[] {
    return Array.from(this.features.values()).filter(
      f => f.category === category
    );
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    return Array.from(this.categories);
  }

  /**
   * Check if feature exists
   */
  hasFeature(featureId: string): boolean {
    return this.features.has(featureId);
  }

  /**
   * Get feature component
   */
  getFeatureComponent(featureId: string): React.ComponentType<FeatureComponentProps> | undefined {
    const feature = this.features.get(featureId);
    return feature?.component;
  }

  /**
   * Update feature
   */
  updateFeature(featureId: string, updates: Partial<Feature>): void {
    const feature = this.features.get(featureId);
    if (!feature) {
      console.warn(`Feature "${featureId}" not found`);
      return;
    }

    const updatedFeature = { ...feature, ...updates };
    this.features.set(featureId, updatedFeature);

    if (updates.category) {
      this.categories.add(updates.category);
    }

    this.notifyListeners();
  }

  /**
   * Subscribe to feature registry changes
   */
  subscribe(listener: (features: Map<string, Feature>) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.features));
  }

  /**
   * Get features with permissions
   */
  getFeaturesWithPermissions(permissions: string[]): Feature[] {
    return Array.from(this.features.values()).filter(feature => {
      if (!feature.permissions || feature.permissions.length === 0) {
        return true;
      }
      return feature.permissions.some(p => permissions.includes(p));
    });
  }

  /**
   * Clear all features
   */
  clear(): void {
    this.features.clear();
    this.categories.clear();
    this.notifyListeners();
  }

  /**
   * Get feature stats
   */
  getStats(): {
    totalFeatures: number;
    featuresByCategory: Record<string, number>;
    disabledFeatures: number;
  } {
    const features = Array.from(this.features.values());
    const featuresByCategory: Record<string, number> = {};

    features.forEach(f => {
      featuresByCategory[f.category] = (featuresByCategory[f.category] || 0) + 1;
    });

    return {
      totalFeatures: features.length,
      featuresByCategory,
      disabledFeatures: features.filter(f => f.disabled).length,
    };
  }
}

// Singleton instance
export const featureRegistry = new FeatureRegistry();

/**
 * React Hook to use the feature registry
 */
export const useFeatureRegistry = () => {
  const [features, setFeatures] = React.useState<Map<string, Feature>>(
    () => new Map(featureRegistry.getAllFeatures().map(f => [f.id, f]))
  );

  React.useEffect(() => {
    const unsubscribe = featureRegistry.subscribe(setFeatures);
    return unsubscribe;
  }, []);

  return {
    features: Array.from(features.values()),
    getFeature: (id: string) => features.get(id),
    hasFeature: (id: string) => features.has(id),
    getCategories: () => Array.from(new Set(Array.from(features.values()).map(f => f.category))),
  };
};

/**
 * Get feature component for rendering
 */
export const getFeatureComponent = (featureId: string) => {
  return featureRegistry.getFeatureComponent(featureId);
};

/**
 * Register default features
 */
export const registerDefaultFeatures = () => {
  // These will be registered by their respective modules
  // This function is here as a placeholder for initialization
};
