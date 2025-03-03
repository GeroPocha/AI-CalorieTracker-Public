
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FoodEntry } from '@/lib/types';
import { TrashIcon } from '@radix-ui/react-icons';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FoodListProps {
  entries: FoodEntry[];
  onRemoveEntry: (id: string) => void;
}

export function FoodList({ entries, onRemoveEntry }: FoodListProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (entries.length === 0) {
    return (
      <Card className="animate-slide-up h-[300px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Today's Food</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 flex flex-col items-center justify-center h-[220px] text-center">
          <p className="text-muted-foreground">No food entries yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add your first meal using the form below
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up h-[400px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Today's Food</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 px-0">
        <ScrollArea className="h-[320px] px-4">
          <ul className="space-y-4">
            {entries.map((entry) => (
              <li 
                key={entry.id} 
                className="flex flex-col p-4 rounded-lg bg-secondary/50 animate-scale-in"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-base">{entry.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {entry.amount} {entry.unit} • {formatTime(entry.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-base mr-2">{entry.calories} kcal</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveEntry(entry.id)}
                      className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {(entry.protein || entry.carbs || entry.fat) && (
                  <div className="grid grid-cols-3 gap-2 mt-1">
                      <div className="p-2 rounded bg-primary/10 text-center">
                        <span className="block text-xs text-muted-foreground">Protein</span>
                        <span className="font-medium">{entry.protein}g</span>
                      </div>

                      <div className="p-2 rounded bg-blue-500/10 text-center">
                        <span className="block text-xs text-muted-foreground">Carbs</span>
                        <span className="font-medium">{entry.carbs}g</span>
                      </div>
                    
                      <div className="p-2 rounded bg-amber-500/10 text-center">
                        <span className="block text-xs text-muted-foreground">Fat</span>
                        <span className="font-medium">{entry.fat}g</span>
                      </div>
                    
                  </div>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
