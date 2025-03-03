
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { useCalorieTracker } from '@/hooks/useCalorieTracker';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const History = () => {
  const { allData, changeDate, currentDate } = useCalorieTracker();
  const [date, setDate] = useState<Date | undefined>(new Date(currentDate));

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      changeDate(date.toISOString().split('T')[0]);
    }
  };

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    handleDateChange(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    handleDateChange(next);
  };

  const currentDayData = allData.find(day => day.date === currentDate) || {
    date: currentDate,
    total: 0,
    goal: 2000,
    totalFat: 0,
    totalCarbs: 0,
    totalProtein: 0,
    entries: []
  };

  const progressPercentage = Math.min(Math.round((currentDayData.total / currentDayData.goal) * 100), 100);
  
  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Header />
      <main className="flex-1 container py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">History</h1>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[180px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="icon" onClick={handleNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card className="animate-slide-up">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Daily Summary: {formatDate(currentDate)}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground">Consumed</p>
                    <p className="text-3xl font-bold">{currentDayData.total} kcal</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Goal</p>
                    <p className="text-xl font-medium">{currentDayData.goal} kcal</p>
                  </div>
                </div>
                
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      progressPercentage >= 100 
                        ? 'bg-destructive' 
                        : progressPercentage >= 90 
                          ? 'bg-amber-500' 
                          : 'bg-primary'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                
                <p className="text-sm text-muted-foreground text-center">
                  {progressPercentage}% of daily goal
                </p>

                {/* Macronutrient summary */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
                  <div className="flex flex-col items-center p-2 bg-secondary/30 rounded-md">
                    <span className="text-xs text-muted-foreground">Protein</span>
                    <span className="font-medium">{currentDayData.totalProtein}g</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-secondary/30 rounded-md">
                    <span className="text-xs text-muted-foreground">Carbs</span>
                    <span className="font-medium">{currentDayData.totalCarbs}g</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-secondary/30 rounded-md">
                    <span className="text-xs text-muted-foreground">Fat</span>
                    <span className="font-medium">{currentDayData.totalFat}g</span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Food Entries</p>
                {currentDayData.entries.length > 0 ? (
                  <ScrollArea className="h-[220px]">
                    <ul className="space-y-2">
                      {currentDayData.entries.map((entry) => (
                        <li 
                          key={entry.id}
                          className="p-3 rounded-lg bg-secondary/50 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">{entry.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {entry.amount}{entry.unit} · {format(new Date(entry.timestamp), 'p')}
                              {entry.protein && ` · P: ${entry.protein}g`}
                              {entry.carbs && ` · C: ${entry.carbs}g`}
                              {entry.fat && ` · F: ${entry.fat}g`}
                            </p>
                          </div>
                          <p className="font-medium">{entry.calories} kcal</p>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center h-[220px] bg-secondary/30 rounded-lg border border-dashed">
                    <p className="text-muted-foreground">No entries for this day</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default History;
