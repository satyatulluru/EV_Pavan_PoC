import { v4 as uuidv4 } from 'uuid';

export type UserRole = 'Fleet Admin' | 'OEM Engineer' | 'Service Technician' | 'Vehicle Owner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type BatteryChemistry = 'LFP' | 'NMC';
export type RiskStatus = 'Healthy' | 'Warning' | 'Critical';

export interface CellData {
  id: number;
  voltage: number;
  temperature: number;
  soh: number;
  status: RiskStatus;
}

export interface Vehicle {
  id: string;
  model: string;
  batteryId: string;
  chemistry: BatteryChemistry;
  soc: number;
  soh: number;
  rulMonths: number;
  maxCellTemp: number;
  minCellTemp: number;
  cellVoltageDelta: number;
  ambientTemp: number;
  packVoltage: number;
  packCurrent: number;
  chargeCycles: number;
  bmsFaultCode: string | null;
  chargingStatus: 'Discharging' | 'Charging' | 'Idle';
  riskStatus: RiskStatus;
  cells: CellData[];
  lastUpdate: number;
}

export interface Alert {
  id: string;
  vehicleId: string;
  batteryId: string;
  severity: RiskStatus;
  type: string;
  message: string;
  timestamp: number;
  recommendedAction: string;
  status: 'Open' | 'Acknowledged' | 'Ticket Created';
}

const generateCells = (count: number, chemistry: BatteryChemistry): CellData[] => {
  const cells: CellData[] = [];
  const baseVoltage = chemistry === 'LFP' ? 3.2 : 3.7;
  for (let i = 0; i < count; i++) {
    const tempVariant = Math.random() * 5;
    const voltVariant = Math.random() * 0.05;
    cells.push({
      id: i + 1,
      voltage: Number((baseVoltage + voltVariant).toFixed(3)),
      temperature: Number((25 + tempVariant).toFixed(1)),
      soh: Number((95 + Math.random() * 5).toFixed(1)),
      status: 'Healthy'
    });
  }
  return cells;
};

export const generateMockVehicles = (count: number = 20): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  const models = ['Model S', 'Model 3', 'Model X', 'Model Y', 'Fleet Van Alpha', 'Delivery Pro'];
  
  for (let i = 0; i < count; i++) {
    const chemistry: BatteryChemistry = Math.random() > 0.5 ? 'LFP' : 'NMC';
    const cellCount = 96; // 8x12 grid
    const soc = Math.floor(Math.random() * 80) + 15;
    const soh = Math.floor(Math.random() * 15) + 85; 
    const isCharging = Math.random() > 0.7;
    
    vehicles.push({
      id: `EV-${1000 + i}`,
      model: models[Math.floor(Math.random() * models.length)],
      batteryId: `BAT-${10000 + i}`,
      chemistry,
      soc,
      soh,
      rulMonths: Math.floor(soh * 1.2),
      maxCellTemp: 28 + Math.random() * 5,
      minCellTemp: 25 + Math.random() * 3,
      cellVoltageDelta: 0.02 + Math.random() * 0.03,
      ambientTemp: 22,
      packVoltage: chemistry === 'LFP' ? cellCount * 3.2 : cellCount * 3.7,
      packCurrent: isCharging ? 150 : -(Math.random() * 50),
      chargeCycles: Math.floor(Math.random() * 500) + 50,
      bmsFaultCode: null,
      chargingStatus: isCharging ? 'Charging' : 'Discharging',
      riskStatus: soh > 90 ? 'Healthy' : soh > 80 ? 'Warning' : 'Critical',
      cells: generateCells(cellCount, chemistry),
      lastUpdate: Date.now()
    });
  }
  return vehicles;
};

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'fleet@demo.com', role: 'Fleet Admin' },
  { id: '2', name: 'OEM Engineer', email: 'oem@demo.com', role: 'OEM Engineer' },
  { id: '3', name: 'Service Tech', email: 'service@demo.com', role: 'Service Technician' },
  { id: '4', name: 'Vehicle Owner', email: 'owner@demo.com', role: 'Vehicle Owner' }
];
