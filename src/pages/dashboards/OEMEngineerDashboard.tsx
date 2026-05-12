import React from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BrainCircuit, Cpu, DatabaseZap, Network } from 'lucide-react';

export default function OEMEngineerDashboard() {
  const { vehicles } = useStore();

  const totalVehicles = vehicles.length;
  
  // Fake degradation data
  const degradationData = Array.from({ length: 12 }).map((_, i) => ({
    month: `M${i+1}`,
    actual: 100 - (i * 0.5) - (Math.random() * 2),
    predicted: 100 - (i * 0.6),
  }));

  const cellImbalanceData = vehicles.slice(0, 10).map((v, i) => ({
    packId: `PK-${i}`,
    delta: v.cellVoltageDelta
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold tracking-tight">Engineering Analysis</h2>
           <p className="text-muted-foreground">Battery degradation analytics and model confidence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Model Confidence</p>
              <p className="text-3xl font-bold text-blue-600">94.2%</p>
            </div>
            <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <BrainCircuit className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Data Pipeline</p>
              <p className="text-3xl font-bold text-emerald-600">Active</p>
            </div>
            <div className="h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <Network className="h-5 w-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Sync Latency</p>
              <p className="text-3xl font-bold text-amber-400">24ms</p>
            </div>
            <div className="h-10 w-10 bg-amber-500/20 rounded-full flex items-center justify-center">
              <DatabaseZap className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
             <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Compute Nodes</p>
              <p className="text-3xl font-bold text-indigo-400">128</p>
            </div>
            <div className="h-10 w-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
              <Cpu className="h-5 w-5 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
             <CardTitle>SOH Degradation Curve</CardTitle>
             <CardDescription>Actual vs AI Predicted Degradation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={degradationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={['auto', 100]} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip cursor={{ stroke: 'var(--muted)', strokeWidth: 1 }} contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                  <Area type="monotone" dataKey="actual" stroke="#e2e8f0" />
                  <Line type="monotone" dataKey="predicted" stroke="#94a3b8" strokeDasharray="5 5" name="Predicted SOH" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle>Cell Voltage Imbalance Distribution</CardTitle>
             <CardDescription>Maximum delta V across sample packs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cellImbalanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="packId" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                  <Line type="step" dataKey="delta" stroke="#f59e0b" strokeWidth={2} name="Voltage Delta (V)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
