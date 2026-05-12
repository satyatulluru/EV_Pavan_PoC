import React from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { AlertTriangle, Wrench, Thermometer, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router';

export default function ServiceTechDashboard() {
  const { alerts, vehicles, acknowledgeAlert } = useStore();

  const openAlerts = alerts.filter(a => a.status === 'Open');
  const criticalAlerts = openAlerts.filter(a => a.severity === 'Critical');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold tracking-tight">Service Ticket Desk</h2>
           <p className="text-muted-foreground">Manage critical alerts and repair actions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-red-500/20 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-400">Critical Tickets</p>
                <h3 className="text-3xl font-bold text-red-500">{criticalAlerts.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-amber-500/20 p-3 rounded-full">
                <Wrench className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-400">Open Tickets</p>
                <h3 className="text-3xl font-bold text-amber-500">{openAlerts.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/20 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Tickets Created</p>
                <h3 className="text-3xl font-bold text-blue-500">{alerts.filter(a => a.status === 'Ticket Created').length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actionable Alerts</CardTitle>
          <CardDescription>Alerts requiring immediate technician review</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="rounded-md border border-border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Severity</TableHead>
                  <TableHead>Vehicle ID</TableHead>
                  <TableHead>Issue Details</TableHead>
                  <TableHead>Recommended Action</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openAlerts.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={5} className="text-center py-6 text-slate-500">No open alerts at this time.</TableCell>
                  </TableRow>
                ) : openAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Badge variant={alert.severity === 'Critical' ? 'destructive' : 'outline'} className={alert.severity === 'Warning' ? 'text-amber-500 border-amber-500' : ''}>
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{alert.vehicleId}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {alert.type === 'thermal' ? <Thermometer className="w-4 h-4 text-red-400" /> : <Zap className="w-4 h-4 text-amber-400" />}
                        <span>{alert.message}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{alert.recommendedAction}</TableCell>
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end space-x-2">
                         <Button size="sm" variant="outline" asChild>
                           <Link to="/twin">View Twin</Link>
                         </Button>
                         <Button size="sm" onClick={() => acknowledgeAlert(alert.id)}>Resolve</Button>
                       </div>
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
