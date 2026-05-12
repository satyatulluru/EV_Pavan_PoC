import React from 'react';
import { useStore } from '../store/useStore';
import { Button } from './ui/button';
import { Play, PlayCircle, Plus, ChevronRight, CheckCircle2, FileText, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function GuidedDemo() {
  const { isDemoMode, demoStep, nextDemoStep, endDemo, setSimulationMode, toggleSimulation, isSimulating } = useStore();
  const navigate = useNavigate();

  if (!isDemoMode) return null;

  const steps = [
    {
      title: "Step 1: Start Telemetry",
      description: "Initialize the simulated data stream.",
      actionLabel: "Start Simulation",
      icon: <Play className="w-5 h-5 text-emerald-600" />,
      action: () => {
        if (!isSimulating) toggleSimulation();
        nextDemoStep();
      }
    },
    {
      title: "Step 2: Inject Fault",
      description: "Trigger a critical cell thermal runaway event.",
      actionLabel: "Inject Hotspot",
      icon: <ChevronRight className="w-5 h-5 text-amber-500" />,
      action: () => {
        setSimulationMode('Thermal Runaway Risk');
        nextDemoStep();
      }
    },
    {
      title: "Step 3: Access 3D Twin",
      description: "Investigate the real-time pack architecture.",
      actionLabel: "Open 3D Viewer",
      icon: <ChevronRight className="w-5 h-5 text-blue-600" />,
      action: () => {
        navigate('/twin');
        nextDemoStep();
      }
    },
    {
      title: "Step 4: AI Degradation Model",
      description: "Switch to OEM Engineer view to see predictive SOH curves.",
      actionLabel: "Switch Role",
      icon: <ChevronRight className="w-5 h-5 text-indigo-400" />,
      action: () => {
        useStore.getState().login('oem@demo.com');
        navigate('/');
        nextDemoStep();
      }
    },
    {
      title: "Step 5: Review Service Tickets",
      description: "Switch to Service Tech view to dispatch repairs.",
      actionLabel: "Service View",
      icon: <ChevronRight className="w-5 h-5 text-red-400" />,
      action: () => {
        useStore.getState().login('service@demo.com');
        navigate('/');
        nextDemoStep();
      }
    },
    {
      title: "Step 6: Generate Certificate",
      description: "Export an official condition report.",
      actionLabel: "Open Report",
      icon: <FileText className="w-5 h-5 text-emerald-600" />,
      action: () => {
        navigate('/report');
        nextDemoStep();
      }
    },
    {
      title: "Demo Complete",
      description: "You've seen the end-to-end platform capabilities.",
      actionLabel: "End Tour",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      action: () => {
        endDemo();
      }
    }
  ];

  const currentStepInfo = steps[demoStep - 1] || steps[0];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg">
      <div className="bg-white border border-blue-500/30 rounded-2xl shadow-[0_10px_40px_rgba(37,99,235,0.2)] p-4 flex items-center justify-between gap-4 backdrop-blur-xl relative overflow-hidden">
        
        {/* Progress Background Indicator */}
        <div 
          className="absolute left-0 bottom-0 h-1 bg-blue-500 transition-all duration-500" 
          style={{ width: `${(demoStep / steps.length) * 100}%` }}
        />

        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0 shadow-inner border border-orange-300">
             {currentStepInfo.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Investor Tour • {demoStep}/{steps.length}</span>
            </div>
            <h4 className="font-bold text-blue-950 text-lg leading-tight">{currentStepInfo.title}</h4>
            <p className="text-sm text-slate-600">{currentStepInfo.description}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 shrink-0">
          <Button 
            onClick={currentStepInfo.action} 
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 px-6 shadow-lg shadow-blue-600/20"
          >
            {currentStepInfo.actionLabel} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <button 
          onClick={endDemo}
          className="absolute top-2 right-2 text-slate-500 hover:text-blue-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
