
import { PerplexityResponse } from './types';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

const SYSTEM_PROMPT = `
You are a calorie tracking assistant. Your task is to analyze food descriptions and return structured data.
When the user describes food they've eaten, extract the food name, amount, unit, and calculate calories.
Always respond with a valid JSON object containing:
{
  "food": {
    "name": "food name",
    "amount": number,
    "unit": "g/ml/piece/etc",
    "calories": number
  },
  "message": "A human-friendly confirmation message"
}

For example, if the user says "I ate 200g of chicken breast", respond with:
{
  "food": {
    "name": "chicken breast",
    "amount": 200,
    "unit": "g",
    "calories": 330
  },
  "message": "Added 200g of chicken breast (330 calories)"
}

Be precise with calorie calculations, and if a measurement unit isn't specified, use an appropriate default.
`;

export async function analyzeFood(
  text: string,
  apiKey: string
): Promise<PerplexityResponse> {
  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.2,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(content);
      return parsedResponse as PerplexityResponse;
    } catch (e) {
      throw new Error('Failed to parse Perplexity API response');
    }
  } catch (error) {
    console.error('Error analyzing food:', error);
    throw error;
  }
}

// Simulate barcode scanning with Open Food Facts API
export async function getProductByBarcode(barcode: string): Promise<any> {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 0) {
      throw new Error('Product not found');
    }
    
    const product = data.product;
    
    // Extract relevant information
    const result = {
      name: product.product_name,
      calories: product.nutriments?.['energy-kcal_100g'] || 0,
      servingSize: product.serving_quantity || 100,
      servingUnit: product.serving_unit || 'g',
      imageUrl: product.image_url,
    };
    
    return result;
  } catch (error) {
    console.error('Error fetching product data:', error);
    throw error;
  }
}
