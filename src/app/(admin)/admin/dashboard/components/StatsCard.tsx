"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  iconColor?: string;
  iconBg?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
}: StatsCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <Card className="py-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>

            {trend !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {isPositive && (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">
                      +{trend}%
                    </span>
                  </>
                )}
                {isNegative && (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">
                      {trend}%
                    </span>
                  </>
                )}
                {!isPositive && !isNegative && (
                  <span className="text-sm text-muted-foreground">0%</span>
                )}
                {trendLabel && (
                  <span className="text-xs text-muted-foreground ml-1">
                    {trendLabel}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className={`p-3 rounded-full ${iconBg}`}>
            <div className={`h-6 w-6 ${iconColor}`}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
