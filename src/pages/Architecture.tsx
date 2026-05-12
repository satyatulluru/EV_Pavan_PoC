import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Database, Server, Cpu, Cloud, Smartphone, Activity, Radio, Car, ArrowDown, Network, Bot, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Architecture() {
  const { isSimulating } = useStore();

  const Node = ({ title, desc, icon: Icon, active, simulated, highlight }: { title: string, desc: string, icon: any, active: boolean, simulated?: boolean, highlight?: string }) => (
    <div className={`p-5 rounded-xl border relative transition-all duration-700 overflow-hidden ${
      active 
        ? highlight ? `border-${highlight}-500 bg-${highlight}-500/10 shadow-[0_0_20px_rgba(var(--${highlight}-rgb),0.2)]` : 'border-blue-500/50 bg-blue-900/20 shadow-[0_0_20px_rgba(37,99,235,0.15)]'
        : 'border-orange-200 bg-white shadow-none'
    }`}>
       {active && (
         <div className={`absolute -inset-1 bg-gradient-to-r ${highlight ? `from-${highlight}-500 to-${highlight}-400` : 'from-blue-600 to-indigo-600'} opacity-20 blur-xl transition-opacity animate-pulse`} />
       )}
       <div className="flex items-start space-x-4 relative z-10">
         <div className={`p-3 rounded-xl border ${
           active 
             ? highlight ? `bg-${highlight}-500/20 text-${highlight}-400 border-${highlight}-500/50` : 'bg-blue-500/20 text-blue-600 border-blue-500/30 shadow-inner'
             : 'bg-orange-100 text-slate-500 border-orange-300'
         }`}>
           <Icon className="h-6 w-6" />
         </div>
         <div className="flex-1">
           <div className="flex items-center justify-between mb-1">
             <h3 className="font-bold text-slate-800">{title}</h3>
             <div className="flex gap-2">
               {simulated && <Badge variant="outline" className="text-[9px] uppercase border-orange-300 text-slate-600 bg-orange-100">Mock</Badge>}
               <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider ${active ? 'border-emerald-500/50 text-emerald-600 bg-emerald-500/10' : 'border-orange-300 text-slate-500'}`}>
                 {active ? '● LIVE' : 'IDLE'}
               </Badge>
             </div>
           </div>
           <p className="text-xs text-slate-600 font-medium leading-relaxed">{desc}</p>
         </div>
       </div>
    </div>
  );

  const PipePath = () => (
    <div className="flex flex-col items-center justify-center py-2 relative h-12">
      <div className={`w-0.5 h-full ${isSimulating ? 'bg-gradient-to-b from-blue-500/50 to-indigo-500/50' : 'bg-orange-100'}`}></div>
      {isSimulating && (
        <div className="absolute top-0 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)] animate-[slideDown_1.5s_infinite_linear]"></div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mt-4 mb-2">
        <div>
           <h2 className="text-3xl font-bold tracking-tight text-blue-950 mb-2">System Architecture</h2>
           <p className="text-slate-600 text-lg">Digital Twin Telemetry and ML Data Pipeline</p>
        </div>
      </div>

       <Card className="bg-[#0f1524] border-orange-200 shadow-2xl">
        <CardContent className="p-8 md:p-12">
          <div className="max-w-2xl mx-auto space-y-0 relative">
            
            <Node 
              title="Fleet Hardware Simulator" 
              desc="Generates mock CAN bus telemetry packets (voltage, temperature, BMS states)"
              icon={Car}
              active={isSimulating}
              simulated
            />
            
            <PipePath />

            <div className="p-6 md:p-8 rounded-2xl border border-orange-200 bg-white shadow-sm backdrop-blur shadow-lg">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center">
                <Cloud className="w-4 h-4 mr-2 text-blue-500" />
                Cloud Ingestion Layer
              </div>
              <Node 
                title="AWS IoT Core (MQTT)" 
                desc="High-throughput message broker handling secure TLS connections"
                icon={Radio}
                active={isSimulating}
              />

              <PipePath />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Node 
                  title="Kinesis Streams" 
                  desc="Real-time event buffering"
                  icon={Network}
                  active={isSimulating}
                />
                <Node 
                  title="Lambda Engine" 
                  desc="Anomaly filtering & routing"
                  icon={Zap}
                  active={isSimulating}
                  highlight="amber"
                />
              </div>
            </div>

            <PipePath />

            <div className="p-6 md:p-8 rounded-2xl border border-orange-200 bg-white shadow-sm backdrop-blur shadow-lg">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center">
                <Database className="w-4 h-4 mr-2 text-emerald-500" />
                Datalake & Compute Layer
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Node 
                  title="Amazon Timestream" 
                  desc="Time-series telemetry storage"
                  icon={Database}
                  active={isSimulating}
                />
                <Node 
                  title="AWS IoT TwinMaker" 
                  desc="3D spatial node mapping"
                  icon={Activity}
                  active={isSimulating}
                />
              </div>

              <div className="mt-4">
                <Node 
                  title="Amazon SageMaker (ML)" 
                  desc="LSTM model continuously predicting State of Health & Remaining Useful Life"
                  icon={Bot}
                  active={isSimulating}
                  simulated
                  highlight="indigo"
                />
              </div>
            </div>

            <PipePath />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-2 border-dashed border-orange-200 p-6 rounded-2xl">
              <Node 
                title="SaaS Web Portal" 
                desc="React unified dashboard"
                icon={Server}
                active={isSimulating}
              />
              <Node 
                title="Owner Mobile API" 
                desc="GraphQL endpoints for App"
                icon={Smartphone}
                active={isSimulating}
              />
            </div>

          </div>
        </CardContent>
      </Card>
      
      <style>{`
        @keyframes slideDown {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
