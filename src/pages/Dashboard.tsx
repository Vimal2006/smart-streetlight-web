import { Lightbulb, CloudRain, Thermometer, Droplets } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import Navigation from "@/components/Navigation";
import { useStreetlightData } from "@/hooks/useStreetlightData";

const Dashboard = () => {
  const metrics = useStreetlightData();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Real-Time Monitoring
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Live environmental data from streetlight sensors
          </p>
        </div>

        {metrics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <MetricCard
              title="Street Light Intensity"
              value={metrics.lightIntensity}
              unit="%"
              icon={<Lightbulb className="w-6 h-6" />}
              color="primary"
            />
            <MetricCard
              title="Rain Intensity"
              value={metrics.rainIntensity}
              unit="%"
              icon={<CloudRain className="w-6 h-6" />}
              color="secondary"
            />
            <MetricCard
              title="Temperature"
              value={metrics.temperature}
              unit="°C"
              icon={<Thermometer className="w-6 h-6" />}
              color="accent"
              max={50}
            />
            <MetricCard
              title="Humidity"
              value={metrics.humidity}
              unit="%"
              icon={<Droplets className="w-6 h-6" />}
              color="secondary"
            />
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Loading data...</p>
        )}

        <div className="mt-8 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-primary">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-accent animate-glow-pulse" />
              <span className="text-sm text-muted-foreground">All Sensors Online</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-primary animate-glow-pulse" />
              <span className="text-sm text-muted-foreground">Data Stream Active</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-secondary animate-glow-pulse" />
              <span className="text-sm text-muted-foreground">System Healthy</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
