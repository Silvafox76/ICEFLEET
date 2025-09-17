import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardContent from '@/components/dashboard/dashboard-content';

// Mock the API calls
global.fetch = jest.fn();

const mockDashboardStats = {
  totalVehicles: 14,
  activeVehicles: 12,
  totalTrailers: 8,
  totalDrivers: 5,
  activeDrivers: 4,
  complianceAlerts: 3,
  maintenanceDue: 2,
  assignmentsToday: 6
};

const mockComplianceAlerts = [
  {
    id: '1',
    type: 'Registration',
    entityType: 'vehicle',
    entityId: 'v1',
    documentNumber: 'REG-001',
    expiryDate: new Date('2024-02-15'),
    status: 'EXPIRING_SOON',
    daysUntilExpiry: 7,
    priority: 'warning'
  }
];

describe('DashboardContent', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should render dashboard with loading state initially', () => {
    (fetch as jest.Mock).mockImplementation(() => 
      new Promise(() => {}) // Never resolves to keep loading state
    );

    render(<DashboardContent />);
    
    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
  });

  it('should render dashboard stats when data loads', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockDashboardStats
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ alerts: mockComplianceAlerts })
      });

    render(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText('Total Vehicles')).toBeInTheDocument();
      expect(screen.getByText('14')).toBeInTheDocument();
      expect(screen.getByText('Active Vehicles')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });
  });

  it('should render compliance alerts', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockDashboardStats
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ alerts: mockComplianceAlerts })
      });

    render(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText('Compliance Alerts')).toBeInTheDocument();
      expect(screen.getByText('Registration')).toBeInTheDocument();
      expect(screen.getByText('Expires in 7 days')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText('Error loading dashboard data')).toBeInTheDocument();
    });
  });

  it('should display quick action buttons', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockDashboardStats
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ alerts: [] })
      });

    render(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText('Check Compatibility')).toBeInTheDocument();
      expect(screen.getByText('Fleet Registry')).toBeInTheDocument();
      expect(screen.getByText('Driver Management')).toBeInTheDocument();
    });
  });

  it('should show maintenance due count', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockDashboardStats
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ alerts: [] })
      });

    render(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText('Maintenance Due')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });
});
