import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FoodEntry, BarcodeProduct } from '@/lib/types';
import { Mic, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => void;
}

export function AddFoodModal({ isOpen, onClose, onAddFood, perplexity }: AddFoodModalProps) {
  // New state for the manual single input
  const [manualInput, setManualInput] = useState('');
  const [foodText, setFoodText] = useState('');
  // States used for barcode scanning (left unchanged)
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('g');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [tab, setTab] = useState('manual');
  const { toast } = useToast();

  const resetForm = () => {
    setManualInput('');
    setFoodText('');
    setName('');
    setAmount('');
    setUnit('g');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setTab('manual');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (tab === 'manual') {
      if (!manualInput.trim()) {
        toast({
          title: "Missing information",
          description: "Please fill in the food entry.",
          variant: "destructive",
        });
        return;
      }
      try {
        const response = await fetch(
          'Insert the Same Webhook, as used for Speech',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: manualInput }),
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit food entry.",
          variant: "destructive",
        });
        return;
      }
    }
    handleClose();
  };


  const handleAnalyzeFoodText = async () => {
    if (!foodText.trim()) return;
    
    const result = await perplexity.analyzeFoodText(foodText);
    if (result) {
      onAddFood({
        name: result.food.name,
        amount: result.food.amount,
        unit: result.food.unit,
        calories: result.food.calories,
        protein: result.food.protein,
        carbs: result.food.carbs,
        fat: result.food.fat,
      });
      handleClose();
    }
  };

  const handleAudioCapture = () => {
    toast({
      title: "Voice Input",
      description: "Voice recognition would be activated on a real Raspberry Pi.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add Food</DialogTitle>
          <DialogDescription>
            Record what you've eaten to track your calories.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
          </TabsList>
          
          {/* Manual tab now uses one input */}
          <TabsContent value="manual" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="manualInput">Food Entry</Label>
              <Input
                id="manualInput"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="e.g. 120g apple"
                className="glass-input"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="voice" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="foodText">Describe what you ate</Label>
              <div className="flex space-x-2">
                <Textarea
                  id="foodText"
                  value={foodText}
                  onChange={(e) => setFoodText(e.target.value)}
                  placeholder="e.g. I ate 300g of chicken breast with 200g of rice"
                  className="glass-input min-h-[100px]"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleAudioCapture}
                className="w-1/2"
              >
                <Mic className="mr-2 h-4 w-4" />
                Record Voice
              </Button>
              
              <Button
                type="button"
                onClick={handleAnalyzeFoodText}
                disabled={perplexity.isAnalyzing || !foodText.trim()}
                className="w-1/2 ml-2"
              >
                {perplexity.isAnalyzing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Analyze"
                )}
              </Button>
            </div>         
          </TabsContent>
          
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={tab === 'voice'}
          >
            Add Food
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
