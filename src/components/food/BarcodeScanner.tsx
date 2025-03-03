
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Barcode } from 'lucide-react';
import { BarcodeProduct } from '@/lib/types';

interface BarcodeScannerProps {
  onScanResult: (product: BarcodeProduct) => void;
  isScanning: boolean;
  onScan: (barcode: string) => Promise<BarcodeProduct | null>;
}

export function BarcodeScanner({ onScanResult, isScanning, onScan }: BarcodeScannerProps) {
  const [barcode, setBarcode] = useState('');
  
  const handleScan = async () => {
    if (!barcode) return;
    
    const product = await onScan(barcode);
    if (product) {
      onScanResult(product);
      setBarcode('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="barcode">Enter Barcode</Label>
        <div className="flex space-x-2">
          <Input
            id="barcode"
            placeholder="e.g. 5449000000996"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="glass-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleScan();
              }
            }}
          />
          <Button 
            onClick={handleScan}
            disabled={isScanning || !barcode}
            variant="secondary"
          >
            {isScanning ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Barcode className="h-4 w-4 mr-2" />
            )}
            Scan
          </Button>
        </div>
      </div>
      
      <div className="text-center px-6 py-8 border border-dashed rounded-lg bg-secondary/30">
        <Barcode className="h-8 w-8 mx-auto text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          In a real Raspberry Pi setup, scanned barcodes would appear automatically.
        </p>
      </div>
    </div>
  );
}
