import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Vehicle, Alert, User, generateMockVehicles, MOCK_USERS, RiskStatus } from '../lib/mockData';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export type SimulationMode = 'Normal Driving' | 'Fast Charging' | 'Hot Weather' | 'Cell Imbalance' | 'Thermal Runaway Risk' | 'Aging Battery';

interface AppState {
  isDemoMode: boolean;
  demoStep: number;
  startDemo: () => void;
  nextDemoStep: () => void;
  endDemo: () => void;
  currentUser: User | null;
  vehicles: Vehicle[];
  alerts: Alert[];
  isSimulating: boolean;
  simulationMode: SimulationMode;
  login: (email: string) => boolean;
  logout: () => void;
  toggleSimulation: () => void;
  setSimulationMode: (mode: SimulationMode) => void;
  injectFault: (vehicleId: string, faultType: string) => void;
  updateTelemetry: () => void;
  acknowledgeAlert: (alertId: string) => void;
  createTicket: (alertId: string) => void;
  resetData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isDemoMode: false,
      demoStep: 0,
      startDemo: () => set({ isDemoMode: true, demoStep: 1 }),
      nextDemoStep: () => set((state) => ({ demoStep: state.demoStep + 1 })),
      endDemo: () => set({ isDemoMode: false, demoStep: 0 }),
      currentUser: null,
      vehicles: generateMockVehicles(20),
      alerts: [],
      isSimulating: false,
      simulationMode: 'Normal Driving',
      login: (email) => {
        const user = MOCK_USERS.find((u) => u.email === email);
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },
      logout: () => set({ currentUser: null }),
      toggleSimulation: () => {
        const sim = !get().isSimulating;
        set({ isSimulating: sim });
        if (sim) toast.info('Telemetry Simulation Started', { description: `Mode: ${get().simulationMode}` });
        else toast.info('Telemetry Simulation Paused');
      },
      setSimulationMode: (mode) => {
        set({ simulationMode: mode });
        toast.success(`Simulation Mode Changed: ${mode}`);
      },
      injectFault: (vehicleId, faultType) => {
        set((state) => {
          const newVehicles = state.vehicles.map((v) => {
            if (v.id === vehicleId) {
              const nv = { ...v };
              switch (faultType) {
                case 'thermal':
                  nv.maxCellTemp = 60;
                  nv.riskStatus = 'Critical';
                  nv.cells[0].temperature = 60;
                  nv.cells[0].status = 'Critical';
                  break;
                case 'imbalance':
                  nv.cellVoltageDelta = 0.2;
                  nv.riskStatus = 'Critical';
                  nv.cells[1].voltage -= 0.2;
                  nv.cells[1].status = 'Critical';
                  break;
                case 'soc_drop':
                  nv.soc = Math.max(0, nv.soc - 20);
                  nv.riskStatus = 'Warning';
                  break;
              }
              nv.lastUpdate = Date.now();
              return nv;
            }
            return v;
          });

          const messageMap: Record<string, string> = {
            thermal: 'Critical thermal hotspot detected in cell #1',
            imbalance: 'High cell voltage delta detected',
            soc_drop: 'Rapid SOC drop detected'
          };
          
          const message = messageMap[faultType];
          
          const newAlert: Alert = {
            id: uuidv4(),
            vehicleId,
            batteryId: state.vehicles.find(v => v.id === vehicleId)?.batteryId || 'Unknown',
            severity: faultType === 'soc_drop' ? 'Warning' : 'Critical',
            type: faultType,
            message,
            timestamp: Date.now(),
            recommendedAction: faultType === 'thermal' ? 'Cooling system override required' : 'Schedule service center visit',
            status: 'Open'
          };

          toast.error(`Anomaly Detected: ${vehicleId}`, { description: message });

          return { vehicles: newVehicles, alerts: [newAlert, ...state.alerts] };
        });
      },
      updateTelemetry: () => {
        const { isSimulating, vehicles, alerts, simulationMode } = get();
        if (!isSimulating) return;

        let newAlerts = [...alerts];
        let alertGenerated = false;
        
        const newVehicles = vehicles.map((v) => {
          let newSoc = v.soc;
          let newMaxTemp = v.maxCellTemp;
          let newSoh = v.soh;
          let newDelta = v.cellVoltageDelta;
          let newChargingStatus = v.chargingStatus;

          const tempFluctuation = (Math.random() - 0.5) * 1.5;
          const socFluctuation = Math.random() * 0.1;

          switch (simulationMode) {
            case 'Normal Driving':
              newSoc = Math.max(0, v.soc - socFluctuation - 0.1);
              newMaxTemp = Math.max(25, Math.min(35, v.maxCellTemp + tempFluctuation));
              newChargingStatus = 'Idle';
              break;
            case 'Fast Charging':
              newSoc = Math.min(100, v.soc + 0.8 + socFluctuation);
              newMaxTemp = Math.min(48, v.maxCellTemp + 0.3 + tempFluctuation);
              newSoh = Math.max(0, v.soh - 0.005);
              newChargingStatus = 'Charging';
              break;
            case 'Hot Weather':
              newSoc = Math.max(0, v.soc - socFluctuation - 0.15);
              newMaxTemp = Math.min(50, v.maxCellTemp + 0.5 + tempFluctuation);
              newChargingStatus = 'Idle';
              break;
            case 'Cell Imbalance':
              newSoc = Math.max(0, v.soc - socFluctuation - 0.1);
              newMaxTemp = v.maxCellTemp + tempFluctuation;
              newDelta = Math.min(0.3, v.cellVoltageDelta + 0.01);
              break;
            case 'Thermal Runaway Risk':
              newSoc = Math.max(0, v.soc - socFluctuation - 0.2);
              newMaxTemp = v.maxCellTemp + 1.5 + tempFluctuation;
              break;
            case 'Aging Battery':
              newSoc = Math.max(0, v.soc - socFluctuation - 0.3);
              newMaxTemp = v.maxCellTemp + tempFluctuation;
              newSoh = Math.max(0, v.soh - 0.05);
              break;
          }

          // Update individual cells relative to pack trends
          const newCells = v.cells.map(cell => {
             let cellTemp = newMaxTemp + (Math.random() - 0.5) * 2;
             let cellVol = cell.voltage;
             
             if (simulationMode === 'Cell Imbalance' && Math.random() > 0.8) {
               cellVol = Math.max(2.8, cellVol - 0.05);
             }
             if (simulationMode === 'Thermal Runaway Risk' && cell.id === 14) {
               cellTemp += 8; // Force a specific cell into hotspot
             }

             let cellStatus: RiskStatus = 'Healthy';
             if (cellTemp >= 55) cellStatus = 'Critical';
             else if (cellTemp >= 45) cellStatus = 'Warning';

             return { ...cell, temperature: cellTemp, voltage: cellVol, status: cellStatus };
          });
          
          let trueMaxTemp = Math.max(...newCells.map(c => c.temperature));
          let packVoltage = newCells.reduce((acc, c) => acc + c.voltage, 0);

          let newRul = v.rulMonths;
          if (newSoh < 80) newRul = Math.floor((newSoh / 100) * 24);

          const nv: Vehicle = {
            ...v,
            soc: newSoc,
            soh: newSoh,
            cells: newCells,
            maxCellTemp: trueMaxTemp,
            packVoltage: packVoltage,
            cellVoltageDelta: newDelta,
            chargingStatus: newChargingStatus,
            rulMonths: newRul,
            lastUpdate: Date.now(),
          };

          // Generate alerts
          if (trueMaxTemp > 55 && !newAlerts.some(a => a.vehicleId === v.id && a.type === 'thermal' && a.status === 'Open')) {
            nv.riskStatus = 'Critical';
            const msg = `Max cell temperature exceeded critical threshold (${trueMaxTemp.toFixed(1)}°C)`;
            newAlerts.unshift({
              id: uuidv4(),
              vehicleId: v.id,
              batteryId: v.batteryId,
              severity: 'Critical',
              type: 'thermal',
              message: msg,
              timestamp: Date.now(),
              recommendedAction: 'Immediate thermal management required',
              status: 'Open'
            });
            alertGenerated = true;
            toast.error(`Critical Alert: ${v.id}`, { description: msg });
          } else if (newDelta > 0.15 && !newAlerts.some(a => a.vehicleId === v.id && a.type === 'imbalance' && a.status === 'Open')) {
            nv.riskStatus = 'Warning';
            const msg = `Cell voltage delta is significantly high (${newDelta.toFixed(3)}V)`;
            newAlerts.unshift({
              id: uuidv4(),
              vehicleId: v.id,
              batteryId: v.batteryId,
              severity: 'Warning',
              type: 'imbalance',
              message: msg,
              timestamp: Date.now(),
              recommendedAction: 'Schedule cell balancing cycle.',
              status: 'Open'
            });
          }

          if (trueMaxTemp <= 50 && newDelta <= 0.1) nv.riskStatus = 'Healthy';

          return nv;
        });

        set({ vehicles: newVehicles, alerts: newAlerts });
      },
      acknowledgeAlert: (alertId) => {
        set((state) => ({
          alerts: state.alerts.map(a => a.id === alertId ? { ...a, status: 'Acknowledged' } : a)
        }));
        toast.success("Alert Acknowledged");
      },
      createTicket: (alertId) => {
         set((state) => ({
          alerts: state.alerts.map(a => a.id === alertId ? { ...a, status: 'Ticket Created' } : a)
        }));
        toast.success("Service Ticket Created");
      },
      resetData: () => {
        set({ vehicles: generateMockVehicles(20), alerts: [] });
      }
    }),
    {
      name: 'digital-guardian-storage',
    }
  )
);

