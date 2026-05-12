import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useStore } from '../store/useStore';
import { RotateCcw, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { resetData } = useStore();

  const handleReset = () => {
    resetData();
    toast.success('Simulation Data Reset', {
      description: 'A new fleet of 20 randomized vehicles has been generated.'
    });
  };

  const handleSave = () => {
    toast.success('Settings Saved', {
       description: 'Simulation parameters updated.'
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
       <Card>
        <CardHeader>
          <CardTitle>Simulation Parameters</CardTitle>
          <CardDescription>Adjust the behavior of the mocked AWS environment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="freq">Telemetry Frequency (ms)</Label>
              <Input id="freq" defaultValue="3000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="count">Number of Demo Vehicles</Label>
              <Input id="count" defaultValue="20" readOnly className="opacity-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="critical">Critical Temp Threshold (°C)</Label>
              <Input id="critical" defaultValue="55" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="warning">Warning Temp Threshold (°C)</Label>
              <Input id="warning" defaultValue="45" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-border mt-6 pt-6">
           <Button onClick={handleSave}>
             <Save className="h-4 w-4 mr-2" /> Save Config
           </Button>
        </CardFooter>
       </Card>

       <Card className="border-destructive/50 h-max">
        <CardHeader>
           <CardTitle className="text-destructive">Danger Zone</CardTitle>
           <CardDescription>Resetting data will clear all current fleet state, alerts, and mock historical data.</CardDescription>
        </CardHeader>
        <CardContent>
           <Button variant="destructive" onClick={handleReset}>
             <RotateCcw className="h-4 w-4 mr-2" /> Reset All Demo Data
           </Button>
        </CardContent>
       </Card>
    </div>
  );
}
