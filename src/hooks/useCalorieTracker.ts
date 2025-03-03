import { useState, useEffect } from 'react';
import { FoodEntry, DailyCalories } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const DEFAULT_CALORIE_GOAL = 2000;
const DEFAULT_PROTEIN_GOAL = 50;
const DEFAULT_CARBS_GOAL = 275;
const DEFAULT_FAT_GOAL = 65;

export function useCalorieTracker() {
  const [dailyData, setDailyData] = useState<DailyCalories[]>([]);
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase on initial render
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('nutrition_log')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) {
          throw error;
        }

        // Group the data by date
        const groupedData: Record<string, FoodEntry[]> = {};
        data.forEach((entry) => {
          const date = new Date(entry.date).toISOString().split('T')[0];
          if (!groupedData[date]) {
            groupedData[date] = [];
          }

          groupedData[date].push({
            id: entry.id,
            name: entry.food_item,
            amount: parseFloat(entry.amount),
            unit: 'g', // Default unit since it's not stored in the DB separately
            calories: entry.calories,
            protein: entry.protein,
            carbs: entry.carbs,
            fat: entry.fat,
            timestamp: new Date(entry.date)
          });
        });

        // Convert the grouped data to DailyCalories array
        const dailyCalories: DailyCalories[] = Object.keys(groupedData).map(date => {
          const entries = groupedData[date];
          return {
            date,
            entries,
            total: entries.reduce((sum, entry) => sum + entry.calories, 0),
            totalProtein: entries.reduce((sum, entry) => sum + (entry.protein || 0), 0),
            totalCarbs: entries.reduce((sum, entry) => sum + (entry.carbs || 0), 0),
            totalFat: entries.reduce((sum, entry) => sum + (entry.fat || 0), 0),
            goal: DEFAULT_CALORIE_GOAL,
            proteinGoal: DEFAULT_PROTEIN_GOAL,
            carbsGoal: DEFAULT_CARBS_GOAL,
            fatGoal: DEFAULT_FAT_GOAL
          };
        });

        setDailyData(dailyCalories);
      } catch (error) {
        console.error('Error fetching nutrition logs:', error);
        toast({
          title: "Error Loading Data",
          description: "Failed to load your nutrition data.",
          variant: "destructive",
        });
        
        // If loading from Supabase fails, try to load from localStorage as fallback
        const savedData = localStorage.getItem('calorieData');
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            const processedData = parsedData.map((day: any) => ({
              ...day,
              entries: day.entries.map((entry: any) => ({
                ...entry,
                timestamp: new Date(entry.timestamp)
              })),
              proteinGoal: day.proteinGoal || DEFAULT_PROTEIN_GOAL,
              carbsGoal: day.carbsGoal || DEFAULT_CARBS_GOAL,
              fatGoal: day.fatGoal || DEFAULT_FAT_GOAL
            }));
            setDailyData(processedData);
          } catch (e) {
            console.error('Error parsing saved calorie data:', e);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [toast]);

  // Save data to localStorage whenever it changes as a backup
  useEffect(() => {
    if (dailyData.length > 0) {
      localStorage.setItem('calorieData', JSON.stringify(dailyData));
    }
  }, [dailyData]);

  // Get or create the data for the current date
  const getTodayData = (): DailyCalories => {
    const existingDay = dailyData.find(day => day.date === currentDate);
    if (existingDay) {
      return existingDay;
    }
    
    // If no data exists for today, create a new entry
    const newDay: DailyCalories = {
      date: currentDate,
      total: 0,
      goal: DEFAULT_CALORIE_GOAL,
      totalFat: 0,
      totalCarbs: 0,
      totalProtein: 0,
      fatGoal: DEFAULT_FAT_GOAL,
      carbsGoal: DEFAULT_CARBS_GOAL,
      proteinGoal: DEFAULT_PROTEIN_GOAL,
      entries: []
    };
    
    return newDay;
  };

  // Add a new food entry
  const addFoodEntry = async (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => {
    try {
      // First, insert the entry into Supabase
      const { data, error } = await supabase
        .from('nutrition_log')
        .insert({
          food_item: entry.name,
          amount: entry.amount.toString(),
          calories: entry.calories,
          protein: entry.protein || 0,
          carbs: entry.carbs || 0,
          fat: entry.fat || 0,
          date: new Date().toISOString()
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      // Then update the local state
      setDailyData(prevData => {
        const today = getTodayData();
        
        const newEntry: FoodEntry = {
          id: data.id,
          name: entry.name,
          amount: entry.amount,
          unit: entry.unit,
          calories: entry.calories,
          fat: entry.fat || 0,
          carbs: entry.carbs || 0,
          protein: entry.protein || 0,
          timestamp: new Date()
        };
        
        const updatedToday = {
          ...today,
          entries: [...today.entries, newEntry],
          total: today.total + entry.calories,
          totalFat: today.totalFat + (entry.fat || 0),
          totalCarbs: today.totalCarbs + (entry.carbs || 0),
          totalProtein: today.totalProtein + (entry.protein || 0)
        };
        
        // Replace or add the updated day
        const otherDays = prevData.filter(day => day.date !== currentDate);
        return [...otherDays, updatedToday].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      });

      toast({
        title: "Food Added",
        description: `Added ${entry.amount}${entry.unit} of ${entry.name} (${entry.calories} calories)`,
      });

    } catch (error) {
      console.error('Error adding food entry:', error);
      toast({
        title: "Error Adding Food",
        description: "Failed to save your food entry.",
        variant: "destructive",
      });
    }
  };

  // Remove a food entry
  const removeFoodEntry = async (entryId: string) => {
    try {
      // First, delete from Supabase
      const { error } = await supabase
        .from('nutrition_log')
        .delete()
        .eq('id', entryId);

      if (error) {
        throw error;
      }
      
      // Then update the local state
      setDailyData(prevData => {
        const today = getTodayData();
        const entryToRemove = today.entries.find(entry => entry.id === entryId);
        
        if (!entryToRemove) return prevData;
        
        const updatedToday = {
          ...today,
          entries: today.entries.filter(entry => entry.id !== entryId),
          total: today.total - entryToRemove.calories,
          totalFat: today.totalFat - (entryToRemove.fat || 0),
          totalCarbs: today.totalCarbs - (entryToRemove.carbs || 0),
          totalProtein: today.totalProtein - (entryToRemove.protein || 0)
        };
        
        // Replace the updated day
        const otherDays = prevData.filter(day => day.date !== currentDate);
        return [...otherDays, updatedToday].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      });

    } catch (error) {
      console.error('Error removing food entry:', error);
      toast({
        title: "Error Removing Food",
        description: "Failed to remove your food entry.",
        variant: "destructive",
      });
    }
  };

  // Update the calorie goal
  const updateCalorieGoal = (newGoal: number) => {
    setDailyData(prevData => {
      const today = getTodayData();
      
      const updatedToday = {
        ...today,
        goal: newGoal
      };
      
      // Replace or add the updated day
      const otherDays = prevData.filter(day => day.date !== currentDate);
      return [...otherDays, updatedToday].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });

    toast({
      title: "Goal Updated",
      description: `Daily calorie goal set to ${newGoal} calories`,
    });
  };

  // Update macronutrient goals
  const updateMacroGoals = (proteinGoal: number, carbsGoal: number, fatGoal: number) => {
    setDailyData(prevData => {
      const today = getTodayData();
      
      const updatedToday = {
        ...today,
        proteinGoal,
        carbsGoal,
        fatGoal
      };
      
      // Replace or add the updated day
      const otherDays = prevData.filter(day => day.date !== currentDate);
      return [...otherDays, updatedToday].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });

    toast({
      title: "Macro Goals Updated",
      description: `Your macronutrient goals have been updated`,
    });
  };

  // Change the current date
  const changeDate = (date: string) => {
    setCurrentDate(date);
  };

  return {
    currentDate,
    changeDate,
    todayData: getTodayData(),
    allData: dailyData,
    addFoodEntry,
    removeFoodEntry,
    updateCalorieGoal,
    updateMacroGoals,
    isLoading
  };
}
