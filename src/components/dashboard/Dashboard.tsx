
import { useState } from 'react';
import { CalorieGoal } from './CalorieGoal';
import { CalorieProgress } from './CalorieProgress';
import { FoodList } from './FoodList';
import { AddFoodModal } from '../food/AddFoodModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCalorieTracker } from '@/hooks/useCalorieTracker';
import { usePerplexity } from '@/hooks/usePerplexity';
import { Skeleton } from '@/components/ui/skeleton';

export function Dashboard() {
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const { todayData, addFoodEntry, removeFoodEntry, updateCalorieGoal, updateMacroGoals, isLoading } = useCalorieTracker();
  const perplexity = usePerplexity();

  if (isLoading) {
    return (
      <div className="container py-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-[70px] w-full md:w-[200px]" />
          <Skeleton className="h-[150px] w-full flex-1" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-[300px]">
          <CalorieGoal 
            currentGoal={todayData.goal} 
            onUpdateGoal={updateCalorieGoal}
            proteinGoal={todayData.proteinGoal}
            carbsGoal={todayData.carbsGoal}
            fatGoal={todayData.fatGoal}
            onUpdateMacros={updateMacroGoals}
          />
        </div>
        <div className="flex-1">
          <CalorieProgress 
            consumed={todayData.total} 
            goal={todayData.goal}
            fat={todayData.totalFat}
            carbs={todayData.totalCarbs}
            protein={todayData.totalProtein}
            fatGoal={todayData.fatGoal}
            carbsGoal={todayData.carbsGoal}
            proteinGoal={todayData.proteinGoal}
          />
        </div>
      </div>
      
      <FoodList 
        entries={todayData.entries} 
        onRemoveEntry={removeFoodEntry} 
      />
      
      <div className="flex justify-center">
        <Button 
          onClick={() => setIsAddFoodOpen(true)}
          size="lg"
          className="rounded-full px-8 shadow-lg button-transition"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Food
        </Button>
      </div>

      <AddFoodModal
        isOpen={isAddFoodOpen}
        onClose={() => setIsAddFoodOpen(false)}
        onAddFood={addFoodEntry}
        perplexity={perplexity}
      />
    </div>
  );
}
