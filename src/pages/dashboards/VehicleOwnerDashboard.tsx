import React from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { ShieldCheck, Battery, Car, Info, Zap, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router';

export default function VehicleOwnerDashboard() {
  const { vehicles, alerts } = useStore();
  const myVehicle = vehicles[0]; // Abstract to user's registered vehicle

  const openAlerts = alerts.filter(a => a.vehicleId === myVehicle?.id && a.status === 'Open');

  if (!myVehicle) return <div>No vehicle registered.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none">
          <Car className="w-64 h-64 -mr-16 -mt-10" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Owner</h1>
          <p className="text-blue-200">Your {myVehicle.model} is currently {myVehicle.chargingStatus}.</p>
          
          <div className="mt-8 flex items-center space-x-8">
             <div>
               <p className="text-xs text-blue-300 uppercase tracking-widest font-bold mb-1">State of Charge</p>
               <div className="text-4xl font-bold flex items-baseline">
                 {myVehicle.soc.toFixed(0)}<span className="text-xl ml-1">%</span>
               </div>
             </div>
             <div className="h-10 w-px bg-white/20"></div>
             <div>
               <p className="text-xs text-blue-300 uppercase tracking-widest font-bold mb-1">Overall Health</p>
               <div className="flex items-center space-x-2">
                 {myVehicle.riskStatus === 'Healthy' ? (
                   <ShieldCheck className="text-emerald-600 w-8 h-8" />
                 ) : (
                   <AlertTriangle className="text-amber-400 w-8 h-8" />
                 )}
                 <span className="text-2xl font-bold">{myVehicle.riskStatus}</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {openAlerts.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start space-x-4">
           <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
           <div>
             <h4 className="font-bold text-red-500">Service Alert</h4>
             <p className="text-red-400 text-sm mt-1">We detected an anomaly in your battery system. Please schedule a service appointment at your earliest convenience.</p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Zap className="w-5 h-5 mr-2 text-amber-500" /> Charging Advice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 bg-white shadow-sm rounded-lg border border-orange-200">
                <h4 className="font-bold text-sm text-slate-800 mb-2">Optimal Charging Habits</h4>
                <p className="text-sm text-slate-600">Keep your battery between 20% and 80% for daily driving to maximize lifespan. Only charge to 100% for long road trips.</p>
             </div>
             <div className="p-4 bg-white shadow-sm rounded-lg border border-orange-200">
                <h4 className="font-bold text-sm text-slate-800 mb-2">Thermal Management</h4>
                <p className="text-sm text-slate-600">Try to park in the shade during hot days. The battery management system works harder to keep cells cool above 35°C.</p>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Battery className="w-5 h-5 mr-2 text-emerald-500" /> Battery Certificate</CardTitle>
            <CardDescription>Generate an official health report for resale or insurance.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4 h-[200px]">
             <FileText className="w-12 h-12 text-blue-500/50" />
             <p className="text-sm text-slate-600">Your battery is retaining {myVehicle.soh.toFixed(1)}% of its original capacity.</p>
             <Button asChild>
               <Link to="/report">View Full Certificate</Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
