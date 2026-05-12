import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, Filter, Zap } from 'lucide-react';
import { Vehicle } from '../lib/mockData';

type FilterType = 'All' | 'Healthy' | 'Warning' | 'Critical' | 'Charging' | 'Idle';

export default function FleetVehicles() {
  const { vehicles } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.id.toLowerCase().includes(search.toLowerCase()) || v.batteryId.toLowerCase().includes(search.toLowerCase());
    
    let matchesFilter = true;
    if (filter === 'Healthy') matchesFilter = v.riskStatus === 'Healthy';
    if (filter === 'Warning') matchesFilter = v.riskStatus === 'Warning';
    if (filter === 'Critical') matchesFilter = v.riskStatus === 'Critical';
    if (filter === 'Charging') matchesFilter = v.chargingStatus === 'Charging';
    if (filter === 'Idle') matchesFilter = v.chargingStatus === 'Idle' || v.chargingStatus === 'Discharging';

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search Vehicle or Battery ID..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
           {['All', 'Healthy', 'Warning', 'Critical', 'Charging', 'Idle'].map((f) => (
             <Button 
               key={f} 
               variant={filter === f ? 'default' : 'outline'}
               onClick={() => setFilter(f as FilterType)}
               size="sm"
               className="whitespace-nowrap"
             >
               {f}
             </Button>
           ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fleet Registry</CardTitle>
          <CardDescription>Comprehensive overview of all vehicles in your fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Vehicle ID</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Battery ID</TableHead>
                  <TableHead>Chem</TableHead>
                  <TableHead className="text-right">SOC (%)</TableHead>
                  <TableHead className="text-right">SOH (%)</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Max Temp</TableHead>
                  <TableHead className="text-right hidden md:table-cell">RUL</TableHead>
                  <TableHead className="text-right hidden xl:table-cell">Last Update</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No vehicles found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVehicles.map((vehicle: Vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.id}</TableCell>
                      <TableCell className="text-muted-foreground hidden sm:table-cell">{vehicle.model}</TableCell>
                      <TableCell className="text-muted-foreground">{vehicle.batteryId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{vehicle.chemistry}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{vehicle.soc.toFixed(1)}</TableCell>
                      <TableCell className="text-right">{vehicle.soh.toFixed(1)}</TableCell>
                      <TableCell className="text-right text-muted-foreground hidden sm:table-cell">
                        {vehicle.maxCellTemp.toFixed(1)}°C
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell text-muted-foreground">
                        {vehicle.rulMonths} mo
                      </TableCell>
                      <TableCell className="text-right hidden xl:table-cell text-muted-foreground font-mono text-xs whitespace-nowrap">
                        {new Date(vehicle.lastUpdate).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col space-y-1">
                            <Badge variant={vehicle.riskStatus === 'Healthy' ? 'secondary' : vehicle.riskStatus === 'Warning' ? 'outline' : 'destructive'}
                               className={vehicle.riskStatus === 'Healthy' ? 'bg-emerald-500/10 text-emerald-500 w-max' : vehicle.riskStatus === 'Warning' ? 'border-amber-500 text-amber-500 w-max' : 'w-max'}>
                              {vehicle.riskStatus}
                            </Badge>
                            {vehicle.chargingStatus === 'Charging' && (
                              <span className="text-[10px] uppercase font-bold text-blue-500 flex items-center tracking-wider">
                                <Zap className="h-3 w-3 mr-0.5" /> Charging
                              </span>
                            )}
                         </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
