
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/Card';
import { Pencil1Icon, CheckIcon } from '@radix-ui/react-icons';

interface CalorieGoalProps {
  currentGoal: number;
  onUpdateGoal: (newGoal: number) => void;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  onUpdateMacros?: (protein: number, carbs: number, fat: number) => void;
}

export function CalorieGoal({ 
  currentGoal, 
  onUpdateGoal, 
  proteinGoal, 
  carbsGoal, 
  fatGoal,
  onUpdateMacros 
}: CalorieGoalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newGoal, setNewGoal] = useState(currentGoal.toString());
  const [isEditingMacros, setIsEditingMacros] = useState(false);
  const [newProtein, setNewProtein] = useState(proteinGoal.toString());
  const [newCarbs, setNewCarbs] = useState(carbsGoal.toString());
  const [newFat, setNewFat] = useState(fatGoal.toString());

  const handleSave = () => {
    const parsedGoal = parseInt(newGoal, 10);
    if (!isNaN(parsedGoal) && parsedGoal > 0) {
      onUpdateGoal(parsedGoal);
      setIsEditing(false);
    }
  };

  const handleSaveMacros = () => {
    if (onUpdateMacros) {
      const parsedProtein = parseInt(newProtein, 10);
      const parsedCarbs = parseInt(newCarbs, 10);
      const parsedFat = parseInt(newFat, 10);
      
      if (!isNaN(parsedProtein) && !isNaN(parsedCarbs) && !isNaN(parsedFat) &&
          parsedProtein >= 0 && parsedCarbs >= 0 && parsedFat >= 0) {
        onUpdateMacros(parsedProtein, parsedCarbs, parsedFat);
        setIsEditingMacros(false);
      }
    }
  };

  return (
    <Card className="animate-slide-up h-full">
      <CardContent className="p-4">
        <div className="flex flex-col h-full justify-center space-y-4">
          {/* Calories Goal Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Daily Calorie Goal</div>
              {!isEditing ? (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6"
                >
                  <Pencil1Icon className="h-3 w-3" />
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSave}
                  className="h-6 w-6"
                >
                  <CheckIcon className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="flex items-center">
                <Input
                  type="number"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="glass-input text-sm h-8"
                  min="1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSave();
                    }
                  }}
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex items-end">
                <span className="text-2xl font-bold">{currentGoal}</span>
                <span className="text-xs text-muted-foreground ml-1 mb-1">kcal</span>
              </div>
            )}
          </div>
          
          {/* Macros Goal Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Macronutrients</div>
              {!isEditingMacros ? (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsEditingMacros(true)}
                  className="h-6 w-6"
                >
                  <Pencil1Icon className="h-3 w-3" />
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSaveMacros}
                  className="h-6 w-6"
                >
                  <CheckIcon className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {isEditingMacros ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-16">Protein:</span>
                  <Input
                    type="number"
                    value={newProtein}
                    onChange={(e) => setNewProtein(e.target.value)}
                    className="glass-input text-xs h-7"
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveMacros();
                      }
                    }}
                    autoFocus
                  />
                  <span className="text-xs text-muted-foreground">g</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-16">Carbs:</span>
                  <Input
                    type="number"
                    value={newCarbs}
                    onChange={(e) => setNewCarbs(e.target.value)}
                    className="glass-input text-xs h-7"
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveMacros();
                      }
                    }}
                  />
                  <span className="text-xs text-muted-foreground">g</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-16">Fat:</span>
                  <Input
                    type="number"
                    value={newFat}
                    onChange={(e) => setNewFat(e.target.value)}
                    className="glass-input text-xs h-7"
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveMacros();
                      }
                    }}
                  />
                  <span className="text-xs text-muted-foreground">g</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Protein:</span>
                  <span className="text-xs font-medium">{proteinGoal}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Carbs:</span>
                  <span className="text-xs font-medium">{carbsGoal}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Fat:</span>
                  <span className="text-xs font-medium">{fatGoal}g</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
