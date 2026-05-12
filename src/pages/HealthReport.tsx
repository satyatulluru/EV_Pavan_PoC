import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Printer, Download, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Activity, Zap, Thermometer, Info, Car, Battery } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';

export default function HealthReport() {
  const { vehicles, alerts } = useStore();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');

  const vehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  
  if (!vehicle) return null;

  const vehicleAlerts = alerts.filter(a => a.vehicleId === vehicle.id);
  const openAlertsCount = vehicleAlerts.filter(a => a.status === 'Open').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white shadow-sm backdrop-blur-md p-4 rounded-xl border border-orange-200 print:hidden shadow-lg">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
            <SelectTrigger className="w-full sm:w-[280px] bg-orange-50 border-orange-300">
              <SelectValue placeholder="Select Vehicle" />
            </SelectTrigger>
            <SelectContent className="bg-white border-orange-300">
              {vehicles.map(v => (
                <SelectItem key={v.id} value={v.id}>
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-slate-800">{v.id}</span>
                    <span className="text-[10px] text-slate-500">{v.model} - {v.batteryId}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
           <Button variant="outline" onClick={handlePrint} className="flex-1 sm:flex-none border-orange-300 hover:bg-orange-100">
             <Printer className="h-4 w-4 mr-2 text-slate-600" /> Print
           </Button>
           <Button onClick={handlePrint} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
             <Download className="h-4 w-4 mr-2" /> Export PDF
           </Button>
        </div>
      </div>

      {/* Printable Report Container */}
      <div className="bg-white text-black p-10 sm:p-14 rounded-xl shadow-2xl relative overflow-hidden print:p-0 print:shadow-none print:m-0 print:border-0 border border-slate-200 printable-report max-w-[850px] mx-auto">
        
        {/* Certificate Border decoration */}
        <div className="absolute inset-0 border-[12px] border-slate-50 pointer-events-none rounded-xl print:rounded-none"></div>
        <div className="absolute inset-2 border-[1px] border-slate-200 pointer-events-none rounded-lg print:rounded-none"></div>

        {/* Header */}
        <div className="border-b-2 border-slate-200 pb-8 mb-8 flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center space-x-3 mb-5">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
                <ShieldCheck className="h-6 w-6 text-blue-950" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">Digital Guardian</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">EV Battery Digital Twin</h1>
            <p className="text-slate-500 mt-2 text-lg font-medium">Certified Battery Health Assessment</p>
          </div>
          <div className="text-right text-sm text-slate-600 flex flex-col items-end">
             <div className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 mb-3 text-left">
               <p className="font-bold text-slate-900 text-base mb-1">Report ID: <span className="font-mono text-blue-700">DG-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</span></p>
               <p className="flex justify-between gap-4"><span>Issued:</span> <span className="font-medium text-slate-900">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
               <p className="flex justify-between gap-4"><span>Time:</span> <span className="font-medium text-slate-900">{new Date().toLocaleTimeString()}</span></p>
             </div>
             <p className="flex items-center text-xs text-slate-600 font-medium">
               <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" /> System-Verified Telemetry
             </p>
          </div>
        </div>

        {/* Identity Grid */}
        <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center"><Car className="w-4 h-4 mr-2" /> Vehicle Identity</h3>
            <ul className="space-y-3 text-sm">
               <li className="flex flex-col border-b border-slate-200/60 pb-2">
                 <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Asset Registration ID</span>
                 <span className="font-mono text-slate-900 font-bold text-base">{vehicle.id}</span>
               </li>
               <li className="flex justify-between pt-1">
                 <span className="text-slate-600 font-medium">Fleet Cohort</span>
                 <span className="font-bold text-slate-900">{vehicle.model}</span>
               </li>
            </ul>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center"><Battery className="w-4 h-4 mr-2" /> Battery Pack Identity</h3>
             <ul className="space-y-3 text-sm">
               <li className="flex flex-col border-b border-slate-200/60 pb-2">
                 <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Pack Serial Number</span>
                 <span className="font-mono text-slate-900 font-bold text-base">{vehicle.batteryId}</span>
               </li>
               <li className="flex justify-between pt-1">
                 <span className="text-slate-600 font-medium">Cell Chemistry</span>
                 <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-xs uppercase tracking-wider">{vehicle.chemistry}</span>
               </li>
            </ul>
          </div>
        </div>

        {/* Core Metrics Banner */}
        <div className="bg-white text-blue-950 rounded-xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden z-10">
           {/* Abstract background element */}
           <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none"></div>
           
           <div className="mb-6 md:mb-0 relative z-10">
             <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-1">State of Health (SOH)</h2>
             <div className="flex items-baseline gap-2">
               <span className="text-6xl font-black text-blue-950 tracking-tight">{vehicle.soh.toFixed(1)}</span>
               <span className="text-3xl font-bold text-slate-600">%</span>
             </div>
             <p className="text-slate-600 text-xs mt-1 font-medium">Capacity retention vs. factory specification</p>
           </div>

           <div className="flex gap-8 relative z-10">
             <div className="text-right">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Est. Remaining Life</div>
                <div className="text-3xl font-bold text-blue-600">{vehicle.rulMonths} <span className="text-lg text-slate-500">mo</span></div>
             </div>
             <div className="w-px bg-slate-700"></div>
             <div className="text-right">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">State of Charge</div>
                <div className="text-3xl font-bold text-emerald-600">{vehicle.soc.toFixed(1)} <span className="text-lg text-slate-500">%</span></div>
             </div>
           </div>
        </div>

        {/* Technical Telemetry Grid */}
        <div className="mb-10 relative z-10">
          <h3 className="text-lg font-bold text-slate-900 mb-4 border-b-2 border-slate-200 pb-2 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-slate-500" /> Diagnostic Telemetry
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <div className="flex items-center text-slate-500 mb-2">
                  <Thermometer className="w-4 h-4 mr-1.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Max Cell Temp</span>
                </div>
                <div className={cn(
                  "text-2xl font-bold",
                  vehicle.maxCellTemp >= 55 ? "text-red-600" : vehicle.maxCellTemp >= 45 ? "text-amber-600" : "text-slate-900"
                )}>
                  {vehicle.maxCellTemp.toFixed(1)}°C
                </div>
             </div>
             <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <div className="flex items-center text-slate-500 mb-2">
                  <Zap className="w-4 h-4 mr-1.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Voltage Delta</span>
                </div>
                <div className={cn(
                  "text-2xl font-bold font-mono",
                  vehicle.cellVoltageDelta >= 0.15 ? "text-amber-600" : "text-slate-900"
                )}>
                  {vehicle.cellVoltageDelta.toFixed(3)}V
                </div>
             </div>
             <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <div className="flex items-center text-slate-500 mb-2">
                  <Activity className="w-4 h-4 mr-1.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Charge Cycles</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {vehicle.chargeCycles}
                </div>
             </div>
             <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <div className="flex items-center text-slate-500 mb-2">
                  <AlertTriangle className="w-4 h-4 mr-1.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Risk Category</span>
                </div>
                <div className={cn(
                  "text-xl font-black uppercase tracking-wide",
                  vehicle.riskStatus === 'Healthy' ? "text-emerald-600" : vehicle.riskStatus === 'Warning' ? "text-amber-600" : "text-red-600"
                )}>
                  {vehicle.riskStatus}
                </div>
             </div>
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="mb-12 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div>
             <h3 className="text-lg font-bold text-slate-900 mb-4 border-b-2 border-slate-200 pb-2">Alert History</h3>
             {vehicleAlerts.length > 0 ? (
               <div className="space-y-3">
                 <p className="text-sm text-slate-600 font-medium mb-3">Found {openAlertsCount} active alert(s) on this asset.</p>
                 {vehicleAlerts.slice(0, 3).map(alert => (
                   <div key={alert.id} className="border-l-4 p-3 bg-slate-50 border-slate-200" style={{ borderLeftColor: alert.severity === 'Critical' ? '#ef4444' : '#f59e0b' }}>
                     <p className="text-xs font-bold text-slate-900 mb-1">{alert.severity.toUpperCase()} - {new Date(alert.timestamp).toLocaleDateString()}</p>
                     <p className="text-sm text-slate-700">{alert.message}</p>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 text-center">
                 <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                 <p className="text-sm text-slate-600 font-medium">No alerts historically recorded for this asset.</p>
               </div>
             )}
           </div>
           
           <div>
             <h3 className="text-lg font-bold text-slate-900 mb-4 border-b-2 border-slate-200 pb-2">Analysis & Recommendations</h3>
             <div className="space-y-5 bg-blue-50/50 p-5 rounded-xl border border-blue-100">
               <div className="flex space-x-3 items-start">
                  <div className="mt-0.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Degradation Profile</p>
                    <p className="text-slate-700 text-sm mt-0.5 leading-relaxed">Asset is tracking to standard {vehicle.chemistry} degradation curves. Expect ~1.5% capacity loss per 10k miles driven.</p>
                  </div>
               </div>
               
               {vehicle.riskStatus === 'Healthy' ? (
                 <div className="flex space-x-3 items-start border-t border-blue-100 pt-4">
                    <div className="mt-0.5">
                      <ShieldCheck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Operational Readiness</p>
                      <p className="text-slate-700 text-sm mt-0.5 leading-relaxed">Pack is cleared for normal duty cycles. No operational restrictions required.</p>
                    </div>
                 </div>
               ) : (
                 <div className="flex space-x-3 items-start border-t border-blue-100 pt-4">
                    <div className="mt-0.5">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Required Action</p>
                      <p className="text-slate-700 text-sm mt-0.5 leading-relaxed font-medium">
                        {vehicle.riskStatus === 'Critical' 
                          ? 'Immediate removal from service requested. Schedule pack evaluation.' 
                          : 'Schedule preventative maintenance check within 14 days. Limit fast charging.'}
                      </p>
                    </div>
                 </div>
               )}
             </div>
           </div>
        </div>

        {/* Footer & Disclaimer */}
        <div className="border-t-2 border-slate-200 mt-12 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center text-xs text-slate-500 relative z-10 gap-4">
           <div className="max-w-xl">
             <p className="font-bold text-slate-700 mb-1">IMPORTANT DISCLAIMER:</p>
             <p className="leading-relaxed">This is a simulator-based MVP report generated by the Digital Guardian EV Battery Digital Twin. It is intended for demonstration purposes only and does not serve as a certified regulatory or legal document of battery health.</p>
           </div>
           <div className="text-left md:text-right w-full md:w-auto p-3 bg-slate-50 border border-slate-200 rounded-lg">
             <p className="font-mono font-medium text-[10px] text-slate-600 mb-1">CRYPTOGRAPHIC CHECKSUM</p>
             <p className="font-mono font-bold text-[10px] text-slate-700 break-all w-48 mx-auto md:mx-0">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</p>
           </div>
        </div>
      </div>
      
      {/* Global CSS for Print specific fixes */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          #root > div {
             padding: 0 !important;
          }
          .printable-report {
             box-shadow: none !important;
             border: none !important;
             max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
