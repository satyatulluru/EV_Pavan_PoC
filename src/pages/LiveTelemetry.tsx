import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Play, Pause, AlertTriangle, Zap, Thermometer, Activity, BatteryCharging } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function LiveTelemetry() {
  const { vehicles, isSimulating, toggleSimulation, injectFault, updateTelemetry } = useStore();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id);

  const vehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

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
          <Badge variant={isSimulating ? 'default' : 'secondary'} className={isSimulating ? 'bg-primary text-primary-foreground animate-pulse' : ''}>
             {isSimulating ? '● LIVE' : 'PAUSED'}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant={isSimulating ? "outline" : "default"} onClick={toggleSimulation}>
            {isSimulating ? <><Pause className="h-4 w-4 mr-2" /> Pause Simulator</> : <><Play className="h-4 w-4 mr-2" /> Start Simulator</>}
          </Button>
          {!isSimulating && (
            <Button variant="secondary" onClick={() => updateTelemetry()}>
              Step Forward
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-muted-foreground flex items-center">
              <BatteryCharging className="h-4 w-4 mr-2 text-primary" /> State of Charge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{vehicle?.soc.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Status: {vehicle?.chargingStatus}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-muted-foreground flex items-center">
              <Zap className="h-4 w-4 mr-2 text-yellow-500" /> Pack Voltage & Current
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-bold">{vehicle?.packVoltage.toFixed(1)}V</div>
             <p className="text-xs text-muted-foreground mt-1">{vehicle?.packCurrent.toFixed(1)} A</p>
          </CardContent>
        </Card>
        <Card>
           <CardHeader className="py-4">
            <CardTitle className="text-sm text-muted-foreground flex items-center">
              <Thermometer className="h-4 w-4 mr-2 text-red-500" /> Max Cell Temp
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-bold">{vehicle?.maxCellTemp.toFixed(1)}°C</div>
             <p className="text-xs text-muted-foreground mt-1">Min: {vehicle?.minCellTemp.toFixed(1)}°C</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-muted-foreground flex items-center">
              <Activity className="h-4 w-4 mr-2 text-blue-500" /> State of Health
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-bold">{vehicle?.soh.toFixed(1)}%</div>
             <p className="text-xs text-muted-foreground mt-1">Cycles: {vehicle?.chargeCycles}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Telemetry Stream</CardTitle>
            <CardDescription>Live data stream from IoT Core for {vehicle?.id}</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="bg-black text-green-400 font-mono p-4 rounded-md h-[300px] overflow-y-auto text-xs sm:text-sm">
                <div className="flex flex-col space-y-2 opacity-80">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                      {`[${new Date(vehicle.lastUpdate - (i * 3000)).toISOString()}] INFO: TELEMETRY_RECV {"batt_id": "${vehicle.batteryId}", "soc": ${(vehicle.soc + (i * 0.1)).toFixed(2)}, "max_t": ${(vehicle.maxCellTemp - (i*0.2)).toFixed(2)}, "v_delta": ${vehicle.cellVoltageDelta.toFixed(3)}}`}
                    </div>
                  ))}
                </div>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fault Injection Controls</CardTitle>
            <CardDescription>Simulate hardware failures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start border-red-500/30 hover:bg-red-500/10 hover:text-red-500 transition-colors"
              onClick={() => injectFault(vehicle.id, 'thermal')}
            >
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              Thermal Hotspot (60°C)
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-yellow-500/30 hover:bg-yellow-500/10 hover:text-yellow-500 transition-colors"
              onClick={() => injectFault(vehicle.id, 'imbalance')}
            >
              <Zap className="h-4 w-4 mr-2 text-yellow-500" />
              Cell Voltage Imbalance
            </Button>
            <Button 
               variant="outline" 
              className="w-full justify-start border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500 transition-colors"
              onClick={() => injectFault(vehicle.id, 'soc_drop')}
            >
              <BatteryCharging className="h-4 w-4 mr-2 text-orange-500" />
              Rapid SOC Drop
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
