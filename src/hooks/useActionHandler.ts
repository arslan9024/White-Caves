import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNotification } from '../store/slices/notificationSlice';

/**
 * Custom hook for handling quick action clicks across the dashboard
 * Manages navigation, notifications, and action routing
 */
export const useActionHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Route action to appropriate handler/page based on department and service
   */
  const getActionRoute = (action: string, department: string, service?: string): string | null => {
    // Sales Department
    if (department === 'sales') {
      if (action.includes('lead')) {
        if (action.includes('analytics')) return '/dashboard/sales/lead-analytics';
        if (action.includes('view')) return '/dashboard/sales/leads';
        if (action.includes('add')) return '/dashboard/sales/leads/new';
      }
      if (action.includes('deal')) {
        if (action.includes('pipeline')) return '/dashboard/sales/deals/pipeline';
        if (action.includes('analysis')) return '/dashboard/sales/deals/analysis';
        if (action.includes('new')) return '/dashboard/sales/deals/new';
      }
      if (action.includes('negotiation')) {
        if (action.includes('view')) return '/dashboard/sales/negotiations';
        if (action.includes('add')) return '/dashboard/sales/negotiations/new';
      }
      if (action.includes('commission')) {
        if (action.includes('log')) return '/dashboard/sales/commissions/log';
        if (action.includes('calculate')) return '/dashboard/sales/commissions/calculator';
        if (action.includes('report')) return '/dashboard/sales/commissions/report';
      }
    }

    // Property Management
    if (department === 'properties') {
      if (action.includes('portfolio')) return '/dashboard/properties/portfolio';
      if (action.includes('valuation')) return '/dashboard/properties/valuation';
      if (action.includes('document')) return '/dashboard/properties/documents';
      if (action.includes('legal')) return '/dashboard/properties/legal';
      if (action.includes('maintenance')) return '/dashboard/properties/maintenance';
    }

    // Tenant Management
    if (department === 'tenant') {
      if (action.includes('lease')) return '/dashboard/tenant/leases';
      if (action.includes('maintenance')) return '/dashboard/tenant/maintenance';
      if (action.includes('screening')) return '/dashboard/tenant/screening';
      if (action.includes('message')) return '/dashboard/tenant/messages';
    }

    // Finance
    if (department === 'finance') {
      if (action.includes('budget')) return '/dashboard/finance/budget';
      if (action.includes('expense')) return '/dashboard/finance/expenses';
      if (action.includes('cash')) return '/dashboard/finance/cash-flow';
      if (action.includes('reconcile')) return '/dashboard/finance/reconciliation';
      if (action.includes('report')) return '/dashboard/finance/reports';
    }

    // Marketing
    if (department === 'marketing') {
      if (action.includes('campaign')) return '/dashboard/marketing/campaigns';
      if (action.includes('content')) return '/dashboard/marketing/content';
      if (action.includes('nurture')) return '/dashboard/marketing/lead-nurture';
      if (action.includes('analytics')) return '/dashboard/marketing/analytics';
    }

    // HR
    if (department === 'hr') {
      if (action.includes('employee')) return '/dashboard/hr/employees';
      if (action.includes('job')) return '/dashboard/hr/jobs';
      if (action.includes('applicant')) return '/dashboard/hr/applicants';
      if (action.includes('payroll')) return '/dashboard/hr/payroll';
      if (action.includes('leave')) return '/dashboard/hr/leaves';
    }

    // Operations
    if (department === 'operations') {
      if (action.includes('task')) return '/dashboard/operations/tasks';
      if (action.includes('project')) return '/dashboard/operations/projects';
      if (action.includes('sprint')) return '/dashboard/operations/sprints';
      if (action.includes('release')) return '/dashboard/operations/releases';
    }

    // Legal
    if (department === 'legal') {
      if (action.includes('contract')) return '/dashboard/legal/contracts';
      if (action.includes('agreement')) return '/dashboard/legal/agreements';
      if (action.includes('compliance')) return '/dashboard/legal/compliance';
      if (action.includes('document')) return '/dashboard/legal/documents';
    }

    return null;
  };

  /**
   * Handle action click with intelligent routing based on action type
   */
  const handleAction = (actionLabel: string, department: string, service?: string): void => {
    try {
      const action = actionLabel.toLowerCase();

      // Show processing notification
      dispatch(addNotification({
        type: 'info',
        title: 'Processing...',
        message: `Executing ${actionLabel}...`,
        duration: 2000
      }));

      // Get the route for this action
      const route = getActionRoute(action, department, service);

      if (route) {
        // Navigate to the route
        navigate(route);

        // Show success notification
        dispatch(addNotification({
          type: 'success',
          title: 'Success',
          message: `Opening ${actionLabel}...`,
          duration: 2000
        }));
      } else {
        // No route found, show info
        dispatch(addNotification({
          type: 'info',
          title: 'Action',
          message: `${actionLabel} - Feature coming soon`,
          duration: 3000
        }));
      }
    } catch (error) {
      console.error('Action error:', error);
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to execute ${actionLabel}`,
        duration: 4000
      }));
    }
  };

  return {
    handleAction,
    getActionRoute
  };
};

export default useActionHandler;
