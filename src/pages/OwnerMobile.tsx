import { useStore } from '../store/useStore';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { BatteryCharging, ShieldCheck, Zap, Info, Download, AlertTriangle } from 'lucide-react';

export default function OwnerMobile() {
  const { vehicles } = useStore();
  // Assume the owner just has one vehicle
  const vehicle = vehicles[0];

  const estimatedRange = Math.floor((vehicle.soc / 100) * 320); // Mock max range 320mi

  const getStatusMessage = () => {
    if (vehicle.riskStatus === 'Critical') return { title: 'Service Required', desc: 'Please schedule battery service immediately.', color: 'text-red-500', alert: true };
    if (vehicle.riskStatus === 'Warning') return { title: 'Battery Warning', desc: 'Avoid fast charging today due to elevated temperatures.', color: 'text-amber-500', alert: true };
    return { title: 'Battery is Healthy', desc: 'Your battery is performing optimally.', color: 'text-emerald-500', alert: false };
  };

  const status = getStatusMessage();

  return (
    <div className="flex justify-center items-start pt-4 lg:pt-8 bg-black/40 min-h-full rounded-3xl -mx-4 lg:-mx-8">
      {/* Mobile Frame Container */}
      <div className="w-[375px] h-[812px] bg-background border-[8px] border-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-white rounded-b-xl w-40 mx-auto z-50"></div>

        {/* Status Bar Mock */}
        <div className="h-12 w-full flex justify-between items-end px-6 pb-2 text-xs font-medium z-40 bg-background/80 backdrop-blur-md">
           <span>9:41</span>
           <div className="flex space-x-1">
             <div className="w-4 h-3 bg-foreground rounded-sm"></div>
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-6">
          <div className="pt-2 flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-tight">{vehicle.model}</h1>
            <Badge variant="outline" className="text-[10px]">{vehicle.id}</Badge>
          </div>

          {/* Main SOC Display */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-48 h-48 flex items-center justify-center">
               <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                 <circle cx="50" cy="50" r="45" fill="none" stroke="var(--muted)" strokeWidth="6" />
                 <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="6" strokeDasharray={`${vehicle.soc * 2.83} 283`} strokeLinecap="round" className="transition-all duration-1000" />
               </svg>
               <div className="flex flex-col items-center">
                 <span className="text-5xl font-bold">{vehicle.soc.toFixed(0)}<span className="text-2xl text-muted-foreground">%</span></span>
                 <span className="text-sm text-muted-foreground mt-1 flex items-center">
                   <BatteryCharging className="h-4 w-4 mr-1 text-primary" /> {vehicle.chargingStatus}
                 </span>
               </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-3xl font-bold">{estimatedRange} <span className="text-lg text-muted-foreground font-normal">mi</span></p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Estimated Range</p>
            </div>
          </div>

          {/* Status Alert */}
          <div className={`p-4 rounded-2xl flex items-start space-x-3 ${status.alert ? 'bg-red-500/10 border border-red-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
            {status.alert ? <AlertTriangle className={`h-6 w-6 mt-0.5 ${status.color}`} /> : <ShieldCheck className={`h-6 w-6 mt-0.5 ${status.color}`} />}
            <div>
              <h3 className={`font-semibold ${status.color}`}>{status.title}</h3>
              <p className="text-sm text-muted-foreground leading-snug mt-1">{status.desc}</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
                <ShieldCheck className="h-6 w-6 text-primary mb-1" />
                <span className="text-2xl font-bold">{vehicle.soh.toFixed(0)}%</span>
                <span className="text-xs text-muted-foreground line-clamp-1">Health Score (SOH)</span>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
                <Zap className="h-6 w-6 text-blue-500 mb-1" />
                <span className="text-2xl font-bold">{vehicle.packVoltage.toFixed(0)}V</span>
                <span className="text-xs text-muted-foreground line-clamp-1">Pack Voltage</span>
              </CardContent>
            </Card>
          </div>

          {/* Download Cert */}
          <Button className="w-full h-14 rounded-xl text-lg font-medium shadow-lg hover:scale-[1.02] transition-transform">
            <Download className="h-5 w-5 mr-2" />
            Health Certificate
          </Button>

          {/* Tips */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center">
              <Info className="h-4 w-4 mr-2" /> Battery Care
            </h4>
            <div className="p-4 bg-muted/30 rounded-xl space-y-2">
              <p className="text-sm">Maintain SOC between 20% and 80% for daily driving to maximize longevity.</p>
              <p className="text-sm">Avoid fast-charging when pack temperatures exceed 40°C.</p>
            </div>
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="h-1 bg-foreground/20 w-32 rounded-full absolute bottom-2 left-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  );
}
