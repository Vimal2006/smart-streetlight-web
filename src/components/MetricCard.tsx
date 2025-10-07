import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: ReactNode;
  color: "primary" | "secondary" | "accent";
  max?: number;
}

const MetricCard = ({ title, value, unit, icon, color, max = 100 }: MetricCardProps) => {
  const percentage = max ? (value / max) * 100 : value;
  
  const colorClasses = {
    primary: "text-primary border-primary/50",
    secondary: "text-secondary border-secondary/50",
    accent: "text-accent border-accent/50",
  };

  const glowClasses = {
    primary: "glow-primary",
    secondary: "glow-secondary",
    accent: "glow-accent",
  };

  return (
    <Card className={`metric-card group ${colorClasses[color]} animate-fade-in`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-card border ${colorClasses[color]} ${glowClasses[color]} transition-all duration-300 group-hover:scale-110`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-sm mb-1">{title}</p>
          <p className={`text-3xl font-bold ${colorClasses[color]}`}>
            {value.toFixed(1)}
            <span className="text-lg ml-1">{unit}</span>
          </p>
        </div>
      </div>
      
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-500 ${
            color === "primary" ? "bg-primary" : color === "secondary" ? "bg-secondary" : "bg-accent"
          } ${glowClasses[color]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        {percentage.toFixed(0)}% of maximum
      </div>
    </Card>
  );
};

export default MetricCard;
