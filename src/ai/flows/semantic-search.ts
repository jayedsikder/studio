'use server';
/**
 * @fileOverview Implements semantic search for products using natural language queries.
 *
 * - semanticSearch - A function that performs semantic search based on the user query.
 * - SemanticSearchInput - The input type for the semanticSearch function.
 * - SemanticSearchOutput - The return type for the semanticSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SemanticSearchInputSchema = z.object({
  query: z.string().describe('The natural language search query.'),
});
export type SemanticSearchInput = z.infer<typeof SemanticSearchInputSchema>;

const SemanticSearchOutputSchema = z.object({
  results: z.array(z.string()).describe('A list of product names that match the search query.'),
});
export type SemanticSearchOutput = z.infer<typeof SemanticSearchOutputSchema>;

export async function semanticSearch(input: SemanticSearchInput): Promise<SemanticSearchOutput> {
  return semanticSearchFlow(input);
}

const productSearchPrompt = ai.definePrompt({
  name: 'productSearchPrompt',
  input: {schema: SemanticSearchInputSchema},
  output: {schema: SemanticSearchOutputSchema},
  prompt: `You are a search assistant for an e-commerce website.
  Based on the user's query, find the most relevant products from the available products.
  Return a list of product names that match the search query.

  User Query: {{{query}}}

  Available Products: [Product A, Product B, Product C] // Replace with actual product list from tool/database.
  `, // The list of available products will come from a tool in the future
});

const semanticSearchFlow = ai.defineFlow(
  {
    name: 'semanticSearchFlow',
    inputSchema: SemanticSearchInputSchema,
    outputSchema: SemanticSearchOutputSchema,
  },
  async input => {
    const {output} = await productSearchPrompt(input);
    return output!;
  }
);
