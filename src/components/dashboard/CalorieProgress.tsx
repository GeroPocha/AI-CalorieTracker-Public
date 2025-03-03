
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Progress } from "@/components/ui/progress";

interface CalorieProgressProps {
  consumed: number;
  goal: number;
  fat?: number;
  carbs?: number;
  protein?: number;
  fatGoal?: number;
  carbsGoal?: number;
  proteinGoal?: number;
}

export function CalorieProgress({ 
  consumed, 
  goal, 
  fat = 0, 
  carbs = 0, 
  protein = 0,
  fatGoal = 65,  // Default goals if not provided
  carbsGoal = 275,
  proteinGoal = 50
}: CalorieProgressProps) {
  const percentage = Math.min(Math.round((consumed / goal) * 100), 100);
  const remaining = Math.max(goal - consumed, 0);
  
  // Determine color based on percentage
  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-destructive';
    if (percentage >= 90) return 'bg-amber-500';
    return 'bg-primary';
  };

  // Calculate macronutrient percentages
  const proteinPercentage = Math.min(Math.round((protein / proteinGoal) * 100), 100);
  const carbsPercentage = Math.min(Math.round((carbs / carbsGoal) * 100), 100);
  const fatPercentage = Math.min(Math.round((fat / fatGoal) * 100), 100);

  // Add the CSS variable for the progress width animation
  const progressStyle = {
    '--progress-value': `${percentage}%`,
  } as React.CSSProperties;

  return (
    <Card className="animate-slide-up">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Today's Progress</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{consumed}</span>
              <span className="text-sm text-muted-foreground">consumed</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-medium">{remaining}</span>
              <span className="text-sm text-muted-foreground">remaining</span>
            </div>
          </div>
          
          <div className="h-3 w-full bg-secondary rounded-full overflow-hidden" style={progressStyle}>
            <div 
              className={`h-full rounded-full progress-bar-animated ${getProgressColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>{percentage}%</span>
            <span>100%</span>
          </div>

          {/* Macronutrient display with circular progress */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            {/* Protein Circle */}
            <MacroCircle 
              label="Protein" 
              value={protein} 
              goal={proteinGoal} 
              percentage={proteinPercentage} 
              color="#0EA5E9" // Ocean Blue
            />
            
            {/* Carbs Circle */}
            <MacroCircle 
              label="Carbs" 
              value={carbs} 
              goal={carbsGoal} 
              percentage={carbsPercentage} 
              color="#9b87f5" // Primary Purple
            />
            
            {/* Fat Circle */}
            <MacroCircle 
              label="Fat" 
              value={fat} 
              goal={fatGoal} 
              percentage={fatPercentage} 
              color="#F97316" // Bright Orange
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MacroCircleProps {
  label: string;
  value: number;
  goal: number;
  percentage: number;
  color: string;
}

function MacroCircle({ label, value, goal, percentage, color }: MacroCircleProps) {
  // Calculate the circle's properties
  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-secondary"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-lg font-bold">{value}g</span>
          <span className="text-xs text-muted-foreground">{percentage}%</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">Goal: {goal}g</div>
      </div>
    </div>
  );
}
