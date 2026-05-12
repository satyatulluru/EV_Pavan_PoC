import React from 'react';
import { useStore, SimulationMode } from '../../store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Battery, HeartPulse, AlertTriangle, Car, Play, Pause, Settings2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export default function FleetAdminDashboard() {
  const { vehicles, alerts, isSimulating, toggleSimulation, simulationMode, setSimulationMode } = useStore();

  const totalVehicles = vehicles.length;
  const healthyCount = vehicles.filter(v => v.riskStatus === 'Healthy').length;
  const warningCount = vehicles.filter(v => v.riskStatus === 'Warning').length;
  const criticalCount = vehicles.filter(v => v.riskStatus === 'Critical').length;
  
  const avgSoh = (vehicles.reduce((acc, v) => acc + v.soh, 0) / (totalVehicles || 1)).toFixed(1);
  const avgSoc = (vehicles.reduce((acc, v) => acc + v.soc, 0) / (totalVehicles || 1)).toFixed(1);
  
  const openAlerts = alerts.filter(a => a.status === 'Open').length;

  const fleetHealthScore = Math.max(0, 100 - (criticalCount * 5) - (warningCount * 2) - openAlerts).toFixed(1);

  const sohDistribution = [
    { name: '95-100%', count: vehicles.filter(v => v.soh >= 95).length },
    { name: '90-95%', count: vehicles.filter(v => v.soh >= 90 && v.soh < 95).length },
    { name: '80-90%', count: vehicles.filter(v => v.soh >= 80 && v.soh < 90).length },
    { name: '<80%', count: vehicles.filter(v => v.soh < 80).length },
  ];

  const alertPieData = [
    { name: 'Critical', value: criticalCount, color: 'var(--destructive)' },
    { name: 'Warning', value: warningCount, color: '#f59e0b' },
    { name: 'Healthy', value: healthyCount, color: '#10b981' },
  ];

  const MODES: SimulationMode[] = [
    'Normal Driving',
    'Fast Charging',
    'Hot Weather',
    'Cell Imbalance',
    'Thermal Runaway Risk',
    'Aging Battery'
  ];

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <div className="bg-white shadow-sm backdrop-blur-md rounded-2xl border border-orange-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg pb-6">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h2 className="uppercase tracking-widest text-xs font-bold text-slate-700 flex items-center mb-1">
              <Settings2 className="h-4 w-4 mr-2 text-blue-600" />
              Telemetry Simulator
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant={isSimulating ? 'default' : 'secondary'} className={isSimulating ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse' : ''}>
                {isSimulating ? '● ACTIVE' : 'PAUSED'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:w-[220px]">
            <Select value={simulationMode} onValueChange={(val) => setSimulationMode(val as SimulationMode)}>
              <SelectTrigger className="bg-orange-50 border-orange-300 w-full hover:border-orange-400 transition-colors">
                <SelectValue placeholder="Select Mode" />
              </SelectTrigger>
              <SelectContent className="bg-white border-orange-300">
                {MODES.map(mode => (
                  <SelectItem key={mode} value={mode} className="cursor-pointer focus:bg-orange-100 focus:text-blue-950">
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant={isSimulating ? "destructive" : "default"} 
            onClick={toggleSimulation}
            className="w-full sm:w-auto font-bold tracking-wider uppercase text-xs px-6"
          >
            {isSimulating ? (
              <><Pause className="h-4 w-4 mr-2" /> Stop Simulation</>
            ) : (
              <><Play className="h-4 w-4 mr-2" /> Play</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Fleet Health Score</p>
              <p className="text-3xl font-bold">{fleetHealthScore}</p>
            </div>
            <div className="h-10 w-10 bg-orange-500/20 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              <HeartPulse className="h-5 w-5 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Total / Active</p>
              <p className="text-3xl font-bold">{totalVehicles} <span className="text-xl text-slate-400 font-normal">/ {vehicles.filter(v => v.chargingStatus !== 'Idle').length}</span></p>
            </div>
            <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Car className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Avg SOH / SOC</p>
              <p className="text-3xl font-bold text-slate-800">{avgSoh}% <span className="text-xl text-slate-400 font-normal">/ {avgSoc}%</span></p>
            </div>
            <div className="h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Battery className="h-5 w-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
             <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Open Alerts</p>
              <p className="text-3xl font-bold text-red-500">{openAlerts}</p>
            </div>
            <div className="h-10 w-10 bg-red-500/20 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* SOH Trend */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
             <CardTitle className="text-lg">Fleet SOH Distribution</CardTitle>
             <CardDescription>Current State of Health across all active batteries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sohDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk Breakdown */}
        <Card>
          <CardHeader>
             <CardTitle className="text-lg">Risk Breakdown</CardTitle>
             <CardDescription>Vehicles by risk status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={alertPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {alertPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold">{totalVehicles}</span>
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fleet Vehicles Overview</CardTitle>
          <CardDescription>Top 5 vehicles requiring attention or recent updates.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="rounded-md border border-border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Vehicle ID</TableHead>
                  <TableHead>Battery ID</TableHead>
                  <TableHead>Risk Status</TableHead>
                  <TableHead className="text-right">SOC (%)</TableHead>
                  <TableHead className="text-right">SOH (%)</TableHead>
                  <TableHead className="text-right">Max Temp (°C)</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">RUL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles
                  .sort((a, b) => (a.riskStatus === 'Critical' ? -1 : 1))
                  .slice(0, 5)
                  .map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.id}</TableCell>
                    <TableCell className="text-muted-foreground">{vehicle.batteryId}</TableCell>
                    <TableCell>
                      <Badge variant={vehicle.riskStatus === 'Healthy' ? 'secondary' : vehicle.riskStatus === 'Warning' ? 'outline' : 'destructive'}
                             className={vehicle.riskStatus === 'Healthy' ? 'bg-emerald-500/10 text-emerald-500 border-none' : vehicle.riskStatus === 'Warning' ? 'border-amber-500 text-amber-500' : ''}>
                        {vehicle.riskStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{vehicle.soc.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{vehicle.soh.toFixed(1)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {vehicle.maxCellTemp.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell text-muted-foreground">
                      {vehicle.rulMonths} mo
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
