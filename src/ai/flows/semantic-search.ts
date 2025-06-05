
'use server';
/**
 * @fileOverview Implements semantic search for products by calling an external LLM orchestration service
 * to generate embeddings for the query and then searching a vector database.
 *
 * - semanticSearch - A function that performs semantic search based on the user query.
 * - SemanticSearchInput - The input type for the semanticSearch function.
 * - SemanticSearchOutput - The return type for the semanticSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schema for the input to the semantic search flow
const SemanticSearchInputSchema = z.object({
  query: z.string().describe('The natural language search query.'),
});
export type SemanticSearchInput = z.infer<typeof SemanticSearchInputSchema>;

// Schema for an embedding vector
const EmbeddingVectorSchema = z.array(z.number());

// Schema for the response from the embedding generation service
const GenerateEmbeddingsResponseSchema = z.object({
  embeddings: z.array(EmbeddingVectorSchema).describe('A list of embedding vectors, one for each input text.'),
});

// Schema for the input to the vector search service
const VectorSearchInputSchema = z.object({
  embedding: EmbeddingVectorSchema.describe('The query embedding vector.'),
  // Add other potential parameters for vector search, e.g., top_k
});

// Schema for a single search result item from the vector database
const VectorSearchResultItemSchema = z.object({
  productId: z.string().describe('The ID of the matching product.'),
  score: z.number().describe('The similarity score of the match.'),
});

// Schema for the response from the vector search service
const VectorSearchResponseSchema = z.object({
  results: z.array(VectorSearchResultItemSchema).describe('A list of matching product IDs and their scores.'),
});

// Schema for the output of the semantic search flow
const SemanticSearchOutputSchema = z.object({
  results: z.array(VectorSearchResultItemSchema).describe('A list of product IDs and scores that match the search query.'),
});
export type SemanticSearchOutput = z.infer<typeof SemanticSearchOutputSchema>;

// Placeholder URLs for your backend services (replace with actual URLs)
const GENERATE_EMBEDDINGS_URL = '/api/mock/llm/generate-embeddings'; // Mocked endpoint
const VECTOR_DB_SEARCH_URL = '/api/mock/vector-db/search'; // Mocked endpoint


export async function semanticSearch(input: SemanticSearchInput): Promise<SemanticSearchOutput> {
  return semanticSearchFlow(input);
}

const semanticSearchFlow = ai.defineFlow(
  {
    name: 'semanticSearchFlow',
    inputSchema: SemanticSearchInputSchema,
    outputSchema: SemanticSearchOutputSchema,
  },
  async (input) => {
    // 1. Get embedding for the user's query from the LLM Orchestration Service
    let queryEmbedding: z.infer<typeof EmbeddingVectorSchema>;
    try {
      const embeddingResponse = await fetch(GENERATE_EMBEDDINGS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: [input.query] }), // Service expects an array of texts
      });

      if (!embeddingResponse.ok) {
        const errorBody = await embeddingResponse.text();
        console.error(`Error generating embeddings: ${embeddingResponse.status} ${errorBody}`);
        throw new Error(`Failed to generate embeddings: ${embeddingResponse.statusText}`);
      }
      const embeddingsData = GenerateEmbeddingsResponseSchema.parse(await embeddingResponse.json());
      if (!embeddingsData.embeddings || embeddingsData.embeddings.length === 0) {
        throw new Error('No embeddings returned for the query.');
      }
      queryEmbedding = embeddingsData.embeddings[0];
    } catch (error) {
      console.error('Error in embedding generation step:', error);
      return { results: [] }; // Return empty results or throw
    }

    // 2. Search the vector database with the query embedding via your service
    try {
      const vectorSearchInput: z.infer<typeof VectorSearchInputSchema> = { embedding: queryEmbedding };
      const vectorSearchResponse = await fetch(VECTOR_DB_SEARCH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vectorSearchInput),
      });

      if (!vectorSearchResponse.ok) {
        const errorBody = await vectorSearchResponse.text();
        console.error(`Error searching vector database: ${vectorSearchResponse.status} ${errorBody}`);
        throw new Error(`Failed to search vector database: ${vectorSearchResponse.statusText}`);
      }
      const searchResultsData = VectorSearchResponseSchema.parse(await vectorSearchResponse.json());
      return { results: searchResultsData.results };
    } catch (error) {
      console.error('Error in vector search step:', error);
      return { results: [] }; // Return empty results or throw
    }
  }
);
