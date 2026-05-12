import { useStore, SimulationMode } from '../store/useStore';
import FleetAdminDashboard from './dashboards/FleetAdminDashboard';
import OEMEngineerDashboard from './dashboards/OEMEngineerDashboard';
import ServiceTechDashboard from './dashboards/ServiceTechDashboard';
import VehicleOwnerDashboard from './dashboards/VehicleOwnerDashboard';

export default function Dashboard() {
  const { currentUser } = useStore();

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  // Render role-specific dashboards
  switch (currentUser.role) {
    case 'Fleet Admin':
      return <FleetAdminDashboard />;
    case 'OEM Engineer':
      return <OEMEngineerDashboard />;
    case 'Service Technician':
      return <ServiceTechDashboard />;
    case 'Vehicle Owner':
      return <VehicleOwnerDashboard />;
    default:
      return <FleetAdminDashboard />; // Fallback
  }
}

