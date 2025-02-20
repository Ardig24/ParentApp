import { useState } from 'react';
import { Child, HealthRecord } from '../lib/store';
import { generateAIResponse, testAIConnection } from '../lib/ai';
import { differenceInMonths, format } from 'date-fns';

interface AIHealthResponse {
  tips: Array<{
    title: string;
    content: string;
    icon: string;
  }>;
  milestones: string[];
  resources: Array<{
    title: string;
    description: string;
    url: string;
  }>;
}

export function useAIHealth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateHealthTips = async (
    child: Child,
    healthRecords: HealthRecord[]
  ): Promise<AIHealthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Test API connection first
      const isConnected = await testAIConnection();
      if (!isConnected) {
        throw new Error('Could not connect to AI API. Please check your internet connection and try again.');
      }
      const ageInMonths = differenceInMonths(new Date(), new Date(child.birthDate));
      const recentHealthRecords = healthRecords
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      const prompt = `You are a pediatric health expert. Create a structured JSON response with personalized advice.

Child Details:
- Name: ${child.name}
- Age: ${ageInMonths} months

Recent Medical History:
${recentHealthRecords.map(record => `- ${format(new Date(record.date), 'MMM d, yyyy')}: ${record.type} - ${record.title}${record.notes ? ` (${record.notes})` : ''}`).join('\n')}

Provide a JSON response with exactly:
- 3 health tips (with title, content, and icon)
- 4 developmental milestones
- 2 parent resources (with title, description, and URL)

Response format:
{
  "tips": [
    {
      "title": "string",
      "content": "string",
      "icon": "one of: moon, nutrition, fitness, heart, medical, baby"
    }
  ],
  "milestones": ["string"],
  "resources": [
    {
      "title": "string",
      "description": "string",
      "url": "string"
    }
  ]
}`;

      const aiResponse = await generateAIResponse({ 
        prompt,
        temperature: 0.7,
        maxTokens: 1000
      });

      const parsedResponse = JSON.parse(aiResponse);
      
      return parsedResponse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate health tips');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateHealthTips,
    isLoading,
    error
  };
}
