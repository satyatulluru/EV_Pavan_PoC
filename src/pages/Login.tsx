import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Battery, ShieldCheck, ArrowRight, PlayCircle, Lock, LayoutDashboard } from 'lucide-react';

export default function Login() {
  const { login, startDemo } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123'); // Preset password
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(email)) {
      setError('Invalid credentials. Please use demo emails.');
    }
  };

  const autofill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  const handleGuidedDemo = () => {
    login('fleet@demo.com');
    startDemo();
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center py-12 px-2 sm:px-6 relative overflow-y-auto overflow-x-hidden font-sans text-slate-300">
      {/* Abstract Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-900/20 blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-emerald-900/10 blur-[120px]"></div>
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] mix-blend-screen rounded-full bg-indigo-500/5 blur-[100px]"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 w-full max-w-5xl my-auto">
        <div className="mb-10 flex flex-col items-center text-center max-w-2xl">
        <div className="h-20 w-20 bg-blue-600/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(37,99,235,0.3)] border border-blue-500/30">
          <Battery className="h-10 w-10 text-blue-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-white">Digital Guardian</h1>
        <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-xl">
          Real-time EV Battery Intelligence through <span className="text-blue-400">Digital Twins</span>
        </p>
      </div>

      <div className="z-10 flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        <Card className="flex-1 border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl rounded-2xl">
          <CardHeader className="space-y-2 pb-4">
             <div className="flex items-center gap-3 mb-2">
                 <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/20">
                    <Lock className="w-6 h-6 text-blue-400" />
                 </div>
                 <CardTitle className="text-2xl text-slate-100 font-bold">Secure Access</CardTitle>
             </div>
            <CardDescription className="text-slate-400 text-base">
              Enter your corporate credentials to access the telemetry portal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-slate-300 font-medium text-sm tracking-wide">Work Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="fleet@demo.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950/50 border-slate-700 h-14 text-lg focus-visible:ring-blue-500 rounded-xl"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-slate-300 font-medium text-sm tracking-wide">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-950/50 border-slate-700 h-14 text-lg focus-visible:ring-blue-500 rounded-xl"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
              <Button type="submit" className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all rounded-xl">
                Sign In <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>

            <div className="mt-10">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
                  <span className="bg-[#0f1524] px-4 text-slate-500">
                    Quick Demo Roles
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" onClick={() => autofill('fleet@demo.com')} className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium h-12 rounded-xl transition-colors">
                  Fleet Admin
                </Button>
                <Button variant="outline" size="sm" onClick={() => autofill('oem@demo.com')} className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium h-12 rounded-xl transition-colors">
                  OEM Engineer
                </Button>
                <Button variant="outline" size="sm" onClick={() => autofill('service@demo.com')} className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium h-12 rounded-xl transition-colors">
                  Service Tech
                </Button>
                <Button variant="outline" size="sm" onClick={() => autofill('owner@demo.com')} className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium h-12 rounded-xl transition-colors">
                  Vehicle Owner
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guided Demo Promo */}
        <Card className="flex-1 border-blue-500/30 bg-gradient-to-br from-blue-900/40 to-slate-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden group rounded-2xl flex flex-col">
          <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-500"></div>
          <CardHeader className="space-y-4 pb-6 mt-2 relative z-10 shrink-0">
             <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest w-fit mb-2">
                <PlayCircle className="w-4 h-4" /> Investor Demo
             </div>
             <CardTitle className="text-4xl text-white font-extrabold leading-tight tracking-tight">See the platform in action.</CardTitle>
             <CardDescription className="text-slate-300 text-lg leading-relaxed">
               Take a guided 6-step tour of the Digital Guardian system tailored for high-stakes investor evaluation.
             </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-8 relative z-10">
             <ul className="space-y-5 flex-1">
               <li className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center text-sm font-bold text-blue-300 shrink-0 mt-0.5 shadow-[0_0_15px_rgba(37,99,235,0.3)]">1</div>
                 <p className="text-slate-300 text-base leading-relaxed">Start telemetry simulation and watch real-time data flow.</p>
               </li>
               <li className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center text-sm font-bold text-blue-300 shrink-0 mt-0.5 shadow-[0_0_15px_rgba(37,99,235,0.3)]">2</div>
                 <p className="text-slate-300 text-base leading-relaxed">Inject a thermal anomaly to trigger fault detection.</p>
               </li>
               <li className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center text-sm font-bold text-blue-300 shrink-0 mt-0.5 shadow-[0_0_15px_rgba(37,99,235,0.3)]">3</div>
                 <p className="text-slate-300 text-base leading-relaxed">Inspect cell-level damage in the 3D twin viewer.</p>
               </li>
               <li className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center text-sm font-bold text-blue-300 shrink-0 mt-0.5 shadow-[0_0_15px_rgba(37,99,235,0.3)]">...</div>
                 <p className="text-slate-300 text-base leading-relaxed">Generate actionable service tickets & export certificates.</p>
               </li>
             </ul>

             <div className="pt-2 mt-auto shrink-0">
                 <Button 
                   onClick={handleGuidedDemo}
                   className="w-full h-16 text-xl font-bold bg-white text-blue-900 hover:bg-slate-100 shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all rounded-xl"
                 >
                   Start Interactive Tour <ArrowRight className="w-6 h-6 ml-3" />
                 </Button>
                 <p className="text-center text-sm text-slate-400 font-medium mt-4 tracking-wide uppercase">Estimated time: 2 Minutes</p>
             </div>
          </CardContent>
        </Card>
      </div>

      </div>
      
      <div className="mt-8 flex gap-8 text-sm font-medium text-slate-600 z-10 w-full justify-center hidden md:flex shrink-0">
         <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> SOC 2 Type II Compliant</span>
         <span>|</span>
         <span>End-to-End Encryption</span>
         <span>|</span>
         <span className="font-mono text-xs">V2.4.1-STABLE</span>
      </div>
    </div>
  );
}
