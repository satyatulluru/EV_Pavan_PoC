import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BrainCircuit, TrendingDown, Hourglass, ShieldAlert } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export default function Prediction() {
  const { vehicles } = useStore();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id);

  const vehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  // Mock prediction data
  const predictionData = [
    { month: 'Now', soh: vehicle?.soh },
    { month: '+3 Mo', soh: Math.max(0, vehicle?.soh - 0.5) },
    { month: '+6 Mo', soh: Math.max(0, vehicle?.soh - 1.2) },
    { month: '+9 Mo', soh: Math.max(0, vehicle?.soh - 2.1) },
    { month: '+12 Mo', soh: Math.max(0, vehicle?.soh - 3.5) },
    { month: '+18 Mo', soh: Math.max(0, vehicle?.soh - 5.8) },
    { month: '+24 Mo', soh: Math.max(0, vehicle?.soh - 8.5) },
  ];

  const rulData = [
    { month: 'Now', remaining: vehicle?.rulMonths },
    { month: '+3 Mo', remaining: Math.max(0, vehicle?.rulMonths - 3) },
    { month: '+6 Mo', remaining: Math.max(0, vehicle?.rulMonths - 6) },
    { month: '+9 Mo', remaining: Math.max(0, vehicle?.rulMonths - 9) },
    { month: '+12 Mo', remaining: Math.max(0, vehicle?.rulMonths - 12) },
  ];

  const confidenceScore = vehicle?.soh > 90 ? 94 : vehicle?.soh > 80 ? 88 : 76;
  const degradationRisk = vehicle?.soh > 90 ? 'Low' : vehicle?.soh > 80 ? 'Medium' : 'High';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-xl border border-border">
        <div className="flex items-center space-x-4">
          <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map(v => (
                <SelectItem key={v.id} value={v.id}>
                  {v.id} - {v.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-md border border-border">
          <BrainCircuit className="h-4 w-4 mr-2 text-primary" />
          <span>SageMaker LSTM Predictive Model (v2.1)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Current SOH</p>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">{vehicle?.soh.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Measured from BMS</p>
          </CardContent>
        </Card>
        <Card>
           <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Predicted SOH (12mo)</p>
              <TrendingDown className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-amber-500">{predictionData[4].soh.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1 text-amber-500/80">- {Math.abs(predictionData[4].soh - vehicle?.soh).toFixed(1)}% decline</p>
          </CardContent>
        </Card>
        <Card>
           <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Est. RUL</p>
              <Hourglass className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-500">{vehicle?.rulMonths} mo</p>
            <p className="text-xs text-muted-foreground mt-1">Remaining Useful Life</p>
          </CardContent>
        </Card>
        <Card>
           <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Degradation Risk</p>
              <ShieldAlert className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center mt-1">
              <p className="text-3xl font-bold mr-2">{degradationRisk}</p>
              <Badge variant="outline">{confidenceScore}% Confidence</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>SOH Forecast Curve</CardTitle>
            <CardDescription>Predicted State of Health degradation over next 24 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={predictionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSoh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={['dataMin - 5', 'dataMax + 2']} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                  <Area type="monotone" dataKey="soh" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSoh)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Remaining Useful Life (RUL)</CardTitle>
            <CardDescription>Estimated months until SOH hits 70% critical threshold</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rulData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRul" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                  <Area type="monotone" dataKey="remaining" stroke="#e2e8f0" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
