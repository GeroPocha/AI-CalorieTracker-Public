import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast"

export default function Settings() {
  const [perplexityApiKey, setPerplexityApiKey] = useState<string>(localStorage.getItem('perplexityApiKey') || '');
  const { toast } = useToast()

  const handleSaveApiKey = () => {
    localStorage.setItem('perplexityApiKey', perplexityApiKey);
    toast({
      title: "API Key Saved",
      description: "Your Perplexity API key has been saved.",
    })
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Perplexity AI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="perplexity-api-key">API Key</Label>
                <Input
                  id="perplexity-api-key"
                  placeholder="sk-..."
                  type="password"
                  value={perplexityApiKey}
                  onChange={(e) => setPerplexityApiKey(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveApiKey}>Save API Key</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

