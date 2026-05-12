import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Thermometer, Zap, Activity, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import { CellData } from '../lib/mockData';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, RoundedBox, Html, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

function CarBodyShape({ length, width }: { length: number, width: number }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const fx = length / 2;
    const rx = -length / 2;
    
    // Bottom line
    s.moveTo(rx + 1.0, -0.4);
    s.lineTo(fx - 1.0, -0.4);
    
    // Front bumper
    s.quadraticCurveTo(fx + 0.5, -0.4, fx + 0.5, 0.5);
    
    // Hood tip (nose)
    s.quadraticCurveTo(fx + 0.5, 1.0, fx - 0.5, 1.2);
    
    // Hood surface
    s.lineTo(fx - 2.5, 1.4);
    
    // Windshield
    s.quadraticCurveTo(fx - 4.5, 3.2, fx - 5.5, 3.4);
    
    // Roof
    s.lineTo(rx + 4.0, 3.4);
    
    // Rear window
    s.quadraticCurveTo(rx + 1.5, 3.2, rx + 0.5, 1.8);
    
    // Trunk / Rear bumper
    s.quadraticCurveTo(rx - 0.5, 1.5, rx - 0.5, 0.5);
    s.quadraticCurveTo(rx - 0.5, -0.4, rx + 1.0, -0.4);
    
    return s;
  }, [length]);

  const extrudeSettings = {
    steps: 1,
    depth: width - 1.6, // Subtracting bevel size twice
    bevelEnabled: true,
    bevelThickness: 0.8,
    bevelSize: 0.8,
    bevelSegments: 16
  };

  return (
    <group position={[0, 0, -(width - 1.6) / 2]}>
      <mesh>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.15} 
          transmission={0.9} 
          roughness={0.1} 
          clearcoat={1} 
          clearcoatRoughness={0.1}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
        <Edges scale={1} threshold={30} color="#cbd5e1" opacity={0.6} transparent />
      </mesh>
    </group>
  );
}

function Wheel({ position, radius, thickness }: { position: [number, number, number], radius: number, thickness: number }) {
  return (
    <group position={position}>
      {/* Tire */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, thickness, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      {/* Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.65, radius * 0.65, thickness + 0.1, 16]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

function VehicleFrame({ packLength, packWidth }: { packLength: number, packWidth: number }) {
  const wheelRadius = 1.0;
  const wheelThickness = 0.6;
  const axleX = packLength / 2 + 1.8; 
  const trackZ = packWidth / 2 + 1.2; 
  const carLength = axleX * 2 + 5;
  const carWidth = trackZ * 2 + wheelThickness;

  return (
    <group position={[0, 0, 0]}>
      {/* Wheels */}
      <Wheel position={[axleX, 0, -trackZ]} radius={wheelRadius} thickness={wheelThickness} />
      <Wheel position={[axleX, 0, trackZ]} radius={wheelRadius} thickness={wheelThickness} />
      <Wheel position={[-axleX, 0, -trackZ]} radius={wheelRadius} thickness={wheelThickness} />
      <Wheel position={[-axleX, 0, trackZ]} radius={wheelRadius} thickness={wheelThickness} />

      {/* Axles */}
      <mesh position={[axleX, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, trackZ * 2, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
      <mesh position={[-axleX, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, trackZ * 2, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>

      {/* Side Rails */}
      <mesh position={[0, -0.2, trackZ - 0.4]}>
        <boxGeometry args={[axleX * 2 - 2, 0.2, 0.2]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.2, -(trackZ - 0.4)]}>
        <boxGeometry args={[axleX * 2 - 2, 0.2, 0.2]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Ghost Car Body */}
      <CarBodyShape length={carLength} width={carWidth} />
    </group>
  );
}

function BatteryPack3D({ cells, selectedCellId, setSelectedCellId }: { cells: CellData[], selectedCellId: number | null, setSelectedCellId: (id: number | null) => void }) {
  const cellsPerModule = 8;
  const numModules = Math.ceil(cells.length / cellsPerModule);
  
  // Layout modules in a grid (2 across width)
  const modulesZ = 2;
  const modulesX = Math.ceil(numModules / modulesZ);
  
  // Layout cells within a module in a 2x4 grid
  const cellsX = 2;
  const cellsZ = 4;
  
  const cellWidth = 0.55;
  const cellDepth = 0.45;
  const cellHeight = 0.12;
  
  const cellSpacing = 0.06;
  const moduleSpacing = 0.3;
  
  const moduleWidth = cellsX * (cellWidth + cellSpacing) - cellSpacing;
  const moduleDepth = cellsZ * (cellDepth + cellSpacing) - cellSpacing;
  
  const totalWidth = modulesX * (moduleWidth + moduleSpacing) - moduleSpacing;
  const totalDepth = modulesZ * (moduleDepth + moduleSpacing) - moduleSpacing;

  return (
    <group>
      <VehicleFrame packLength={totalWidth} packWidth={totalDepth} />

      {/* Battery Pack Centered in vehicle */}
      <group position={[0, 0, 0]}>
        {/* Base Board */}
        <RoundedBox 
          args={[totalWidth + 0.6, 0.1, totalDepth + 0.6]} 
          position={[0, -0.1, 0]} 
          radius={0.05}
        >
          <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.5} emissive="#0ea5e9" emissiveIntensity={0.2} />
        </RoundedBox>

        {/* Modules */}
        <group position={[-totalWidth / 2 + moduleWidth / 2, 0, -totalDepth / 2 + moduleDepth / 2]}>
        {Array.from({ length: numModules }).map((_, modIdx) => {
          const modX = modIdx % modulesX;
          const modZ = Math.floor(modIdx / modulesX);
          
          const mx = modX * (moduleWidth + moduleSpacing);
          const mz = modZ * (moduleDepth + moduleSpacing);

          return (
            <group key={`mod-${modIdx}`} position={[mx, 0, mz]}>
              {/* Module Housing */}
              <RoundedBox 
                args={[moduleWidth + 0.15, cellHeight + 0.02, moduleDepth + 0.15]} 
                position={[0, cellHeight/2 - 0.01, 0]} 
                radius={0.02}
              >
                <meshStandardMaterial color="#1e293b" transparent opacity={0.6} roughness={0.3} metalness={0.6} />
              </RoundedBox>
              
              {/* Module Label */}
              <Html position={[0, cellHeight + 0.05, moduleDepth/2 + 0.05]} center>
                <div className="text-[8px] text-slate-400 font-bold uppercase whitespace-nowrap">Mod {modIdx + 1}</div>
              </Html>

              {/* Cells in Module */}
              <group position={[-moduleWidth / 2 + cellWidth / 2, 0, -moduleDepth / 2 + cellDepth / 2]}>
                {Array.from({ length: cellsPerModule }).map((_, cIdx) => {
                  const globalCellIdx = modIdx * cellsPerModule + cIdx;
                  const cell = cells[globalCellIdx];
                  if (!cell) return null; // Safe guard
                  
                  const cxLocal = cIdx % cellsX;
                  const czLocal = Math.floor(cIdx / cellsX);
                  
                  const cx = cxLocal * (cellWidth + cellSpacing);
                  const cz = czLocal * (cellDepth + cellSpacing);

                  const isSelected = selectedCellId === cell.id;
                  
                  let color = '#22c55e'; // default green
                  let emissive = '#22c55e';
                  
                  if (cell.temperature >= 55) { color = '#ef4444'; emissive = '#ef4444'; } // Red
                  else if (cell.temperature >= 48) { color = '#f97316'; emissive = '#f97316'; } // Orange
                  else if (cell.temperature >= 42) { color = '#eab308'; emissive = '#eab308'; } // Yellow
                  else if (cell.temperature >= 35) { color = '#84cc16'; emissive = '#84cc16'; } // Yellow-Green
                  else { color = '#06b6d4'; emissive = '#06b6d4'; } // Cyan/Blue
                  
                  return (
                    <group key={cell.id} position={[cx, isSelected ? 0.05 : 0, cz]}>
                      <RoundedBox 
                        args={[cellWidth, cellHeight, cellDepth]} 
                        position={[0, cellHeight/2, 0]}
                        radius={0.04}
                        onClick={(e) => { e.stopPropagation(); setSelectedCellId(cell.id) }}
                        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
                        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
                      >
                        <meshStandardMaterial 
                          color={color} 
                          emissive={emissive}
                          emissiveIntensity={isSelected || cell.temperature >= 48 ? 0.8 : 0.4}
                          metalness={0.2}
                          roughness={0.2}
                        />
                      </RoundedBox>
                      {isSelected && (
                        <Html position={[0, cellHeight + 0.15, 0]} center zIndexRange={[100, 0]}>
                          <div className="bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow-xl border border-slate-200 pointer-events-none whitespace-nowrap">
                            <div className="text-xs font-bold text-blue-950 mb-1">Cell M{modIdx + 1} - {(cIdx) + 1}</div>
                            <div className="text-[10px] text-slate-600">{cell.temperature.toFixed(1)}°C • {cell.voltage.toFixed(2)}V • SOH {cell.soh.toFixed(1)}%</div>
                          </div>
                        </Html>
                      )}
                    </group>
                  );
                })}
              </group>
            </group>
          );
        })}
      </group>
     </group>
    </group>
  );
}

export default function BatteryTwin() {
  const { vehicles, injectFault } = useStore();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [selectedCellId, setSelectedCellId] = useState<number | null>(null);

  const vehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  
  if (!vehicle) return null;

  const selectedCell = vehicle.cells.find(c => c.id === selectedCellId) || null;

  const getCellColor = (status: string, temp: number) => {
    if (temp >= 55 || status === 'Critical') return 'bg-red-500/80 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] text-white';
    if (temp >= 45 || status === 'Warning') return 'bg-yellow-500/80 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)] text-yellow-900';
    return 'bg-green-500/30 border-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.2)] text-green-200';
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Top Header / Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white shadow-sm backdrop-blur-md p-4 rounded-2xl border border-orange-200">
        <div className="flex items-center space-x-4">
          <Select value={selectedVehicleId} onValueChange={(val) => {
            setSelectedVehicleId(val);
            setSelectedCellId(null);
          }}>
            <SelectTrigger className="w-[280px] bg-orange-50 border-orange-300 focus:ring-blue-500/50">
              <SelectValue placeholder="Select Vehicle" />
            </SelectTrigger>
            <SelectContent className="bg-white border-orange-300">
              {vehicles.map(v => (
                <SelectItem key={v.id} value={v.id}>
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-slate-800">{v.id}</span>
                    <span className="text-[10px] text-slate-500">{v.batteryId}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-[10px] text-slate-700 font-bold uppercase tracking-wider">
              {vehicle.chemistry} Chemistry
            </span>
            <span className={cn(
              "px-3 py-1 rounded-full border text-[10px] uppercase font-bold tracking-wider",
              vehicle.riskStatus === 'Healthy' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
              vehicle.riskStatus === 'Warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
              'bg-red-500/10 border-red-500/20 text-red-500 animate-pulse'
            )}>
              {vehicle.riskStatus}
            </span>
          </div>
        </div>
        <button 
          onClick={() => injectFault(vehicle.id, 'thermal')}
          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-xs font-bold transition-colors flex items-center shadow-lg"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Inject Thermal Hotspot
        </button>
      </div>

      {/* Pack Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Pack SOC', value: `${vehicle.soc.toFixed(1)}%`, color: 'text-white' },
          { label: 'Pack SOH', value: `${vehicle.soh.toFixed(1)}%`, color: 'text-white' },
          { label: 'Max Temp', value: `${vehicle.maxCellTemp.toFixed(1)}°C`, color: vehicle.maxCellTemp > 55 ? 'text-red-400' : vehicle.maxCellTemp > 45 ? 'text-yellow-400' : 'text-green-400' },
          { label: 'Voltage Delta', value: `${vehicle.cellVoltageDelta.toFixed(3)}V`, color: 'text-blue-600 font-mono' },
          { label: 'Remaining Life', value: `${vehicle.rulMonths} mo`, color: 'text-slate-700' },
        ].map((stat, i) => (
          <div key={i} className="bg-white shadow-sm backdrop-blur-md border border-orange-200 p-4 rounded-xl flex flex-col justify-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{stat.label}</div>
            <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-[420px]">
        
        {/* 3D Digital Twin Viewer */}
        <div className="col-span-12 xl:col-span-8 bg-white shadow-sm backdrop-blur-md border border-orange-200 rounded-2xl flex flex-col overflow-hidden relative">
          <div className="p-4 border-b border-orange-200 flex justify-between items-center bg-white/20 absolute top-0 left-0 right-0 z-10 w-full">
            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center">
              Isometric View: <span className="text-blue-600 font-mono ml-2">PACK-{vehicle.batteryId.slice(-6)}</span>
            </h3>
            <div className="flex items-center gap-4 text-[10px] text-slate-600 font-medium">
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500/80 shadow-[0_0_8px_#22c55e] mr-2"></span>Optimal</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500/80 shadow-[0_0_8px_#eab308] mr-2"></span>Elevated</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500/80 shadow-[0_0_8px_#ef4444] mr-2 animate-pulse"></span>Critical</span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-0 mt-0 overflow-hidden relative min-h-[500px] w-full">
             <Canvas camera={{ position: [15, 10, 15], fov: 42 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 12, 5]} intensity={1} castShadow />
                <Environment preset="city" />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate autoRotateSpeed={0.5} />
                <BatteryPack3D cells={vehicle.cells} selectedCellId={selectedCellId} setSelectedCellId={setSelectedCellId} />
             </Canvas>
             
             {/* Legend Overlay */}
             <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
               <div className="flex items-center space-x-2">
                 <span className="text-[10px] uppercase font-bold text-slate-500">Cool</span>
                 <div className="w-32 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 via-yellow-500 to-red-500"></div>
                 <span className="text-[10px] uppercase font-bold text-slate-500">Hot</span>
               </div>
               <div className="text-[10px] font-mono text-slate-500 font-bold">
                 {vehicle.cells.length} cells • {Math.ceil(vehicle.cells.length / 8)} Modules (8 cells/mod)
               </div>
             </div>
          </div>
        </div>

        {/* Selected Cell Panel */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
          <div className="bg-white shadow-sm backdrop-blur-md border border-orange-200 rounded-2xl flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-orange-200 flex justify-between items-center bg-white/20">
              <h3 className="text-xs font-bold uppercase tracking-widest">Cell Diagnostics</h3>
              {selectedCell && (
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] uppercase font-bold",
                  selectedCell.status === 'Healthy' ? 'bg-green-500/20 text-green-400' :
                  selectedCell.status === 'Warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400 animate-pulse'
                )}>
                  {selectedCell.status}
                </span>
              )}
            </div>
            
            <div className="flex-1 p-6 relative">
              {selectedCell ? (
                <div className="space-y-6">
                   <div className="flex items-end justify-between mb-8">
                     <div>
                       <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Observation Target</div>
                       <div className="text-3xl font-mono font-bold text-blue-950">Cell #{selectedCell.id}</div>
                     </div>
                   </div>

                   <div className="space-y-4">
                     <div className="flex justify-between items-center p-3 rounded-lg bg-orange-100/40 border border-orange-300/50">
                       <span className="text-xs text-slate-600 flex items-center font-medium"><Thermometer className="h-4 w-4 mr-2 text-slate-500" /> Temperature</span>
                       <span className={cn(
                         "text-sm font-mono font-bold",
                         selectedCell.temperature >= 55 ? "text-red-400" : selectedCell.temperature >= 45 ? "text-yellow-400" : "text-white"
                       )}>{selectedCell.temperature.toFixed(2)}°C</span>
                     </div>
                     <div className="flex justify-between items-center p-3 rounded-lg bg-orange-100/40 border border-orange-300/50">
                       <span className="text-xs text-slate-600 flex items-center font-medium"><Zap className="h-4 w-4 mr-2 text-slate-500" /> Voltage</span>
                       <span className="text-sm font-mono font-bold text-blue-950">{selectedCell.voltage.toFixed(3)} V</span>
                     </div>
                     <div className="flex justify-between items-center p-3 rounded-lg bg-orange-100/40 border border-orange-300/50">
                       <span className="text-xs text-slate-600 flex items-center font-medium"><Activity className="h-4 w-4 mr-2 text-slate-500" /> State of Health</span>
                       <span className="text-sm font-mono font-bold text-blue-600">{selectedCell.soh.toFixed(1)}%</span>
                     </div>
                   </div>

                   {selectedCell.temperature >= 45 && (
                     <div className={cn(
                       "mt-6 p-4 rounded-xl border text-xs leading-relaxed font-medium",
                       selectedCell.temperature >= 55 ? "bg-red-500/10 border-red-500/20 text-red-200" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-200"
                     )}>
                       <span className={cn("font-bold uppercase tracking-wider block mb-1", selectedCell.temperature >= 55 ? "text-red-400" : "text-yellow-400")}>
                         {selectedCell.temperature >= 55 ? 'Critical Action Required:' : 'System Warning:'}
                       </span>
                       {selectedCell.temperature >= 55 
                        ? 'Thermal runway risk threshold breached. BMS has engaged active liquid cooling override. Schedule preventative service immediately.' 
                        : 'Elevated cell temperature detected. Output derated by 15% to maintain thermal equilibrium.'}
                     </div>
                   )}
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 space-y-4 p-8 text-center">
                  <div className="w-16 h-16 rounded-full border border-orange-300 border-dashed flex items-center justify-center mb-2">
                    <Box className="h-6 w-6 opacity-40" />
                  </div>
                  <p className="text-sm">Select a cell from the 3D Twin visualization to view real-time diagnostics.</p>
                </div>
              )}
            </div>
            
            {/* Action button */}
            {selectedCell && selectedCell.temperature >= 55 && (
              <div className="p-4 border-t border-orange-200 bg-white shadow-sm">
                <button className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                   Dispatch Service Tech
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Box = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
);
