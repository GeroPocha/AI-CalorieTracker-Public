
import { useState } from 'react';
import { analyzeFood, getProductByBarcode } from '@/lib/perplexity';
import { PerplexityResponse, BarcodeProduct } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

export function usePerplexity() {
  const [apiKey, setApiKey] = useState<string>(
    localStorage.getItem('perplexityApiKey') || ''
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const saveApiKey = (key: string) => {
    localStorage.setItem('perplexityApiKey', key);
    setApiKey(key);
  };

  const analyzeFoodText = async (text: string): Promise<PerplexityResponse | null> => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key in settings.",
        variant: "destructive",
      });
      return null;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeFood(text, apiKey);
      return result;
    } catch (error) {
      console.error('Error analyzing food:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the food description. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scanBarcode = async (barcode: string): Promise<BarcodeProduct | null> => {
    setIsScanning(true);
    try {
      const result = await getProductByBarcode(barcode);
      return result;
    } catch (error) {
      console.error('Error scanning barcode:', error);
      toast({
        title: "Scan Failed",
        description: "Could not find product information for this barcode.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  return {
    apiKey,
    setApiKey: saveApiKey,
    isAnalyzing,
    isScanning,
    analyzeFoodText,
    scanBarcode
  };
}
