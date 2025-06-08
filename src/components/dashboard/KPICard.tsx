
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  description: string;
}

export const KPICard = ({ title, value, change, icon: Icon, description }: KPICardProps) => {
  const isPositive = change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  variant={isPositive ? "default" : "destructive"}
                  className={`flex items-center gap-1 ${
                    isPositive 
                      ? "bg-green-100 text-green-700 hover:bg-green-100" 
                      : "bg-red-100 text-red-700 hover:bg-red-100"
                  }`}
                >
                  <TrendIcon className="h-3 w-3" />
                  {Math.abs(change)}%
                </Badge>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
