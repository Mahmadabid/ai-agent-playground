// Utility functions for managing AI models

export interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
}

// Available Gemini models
export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    description: "Fast, lightweight model for quick responses",
    provider: "Google"
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description: "Advanced fast response model with improved capabilities",
    provider: "Google"
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "Best for fast performance on everyday tasks. Enhanced speed and efficiency.",
    provider: "Google"
  },
  {
    id: "gemma-3",
    name: "Gemma 3",
    description: "Open source model with enhanced performance",
    provider: "Google"
  },
  {
    id: "gemma-3n",
    name: "Gemma 3n",
    description: "Nano version of Gemma 3 for efficient processing",
    provider: "Google"
  },
  {
    id: "gemini-2.5-flash-lite-preview-06-17",
    name: "Gemini 2.5 Flash-Lite Preview 06-17",
    description: "Preview version of the next-generation lightweight model",
    provider: "Google"
  },
  {
    id: "gemini-1.5-flash-latest",
    name: "Gemini 1.5 Flash",
    description: "Latest version of the fast response model",
    provider: "Google"
  }
];

export const DEFAULT_MODEL = "gemini-2.0-flash-lite";
const STORAGE_KEY = "selected_ai_model";

/**
 * Get the currently selected AI model
 * @returns The selected model ID or default if none selected
 */
export function getSelectedModel(): string {
  if (typeof window === 'undefined') {
    return DEFAULT_MODEL; // Server-side rendering
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored || DEFAULT_MODEL;
}

/**
 * Save the selected AI model
 * @param modelId The model ID to save
 */
export function saveSelectedModel(modelId: string): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }
  
  // Validate that the model exists
  const modelExists = AVAILABLE_MODELS.some(model => model.id === modelId);
  if (!modelExists) {
    console.warn(`Model ${modelId} not found in available models`);
    return;
  }
  
  localStorage.setItem(STORAGE_KEY, modelId);
}

/**
 * Get the full model object for the currently selected model
 * @returns The selected model object
 */
export function getSelectedModelInfo(): AIModel {
  const selectedId = getSelectedModel();
  return AVAILABLE_MODELS.find(model => model.id === selectedId) || AVAILABLE_MODELS[1]; // Default to flash-latest
}

/**
 * Remove the selected model from localStorage (resets to default)
 */
export function resetSelectedModel(): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }
  
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get a list of all available model IDs
 * @returns Array of model IDs
 */
export function getAvailableModelIds(): string[] {
  return AVAILABLE_MODELS.map(model => model.id);
}

/**
 * Get a list of all available model names
 * @returns Array of model names
 */
export function getAvailableModelNames(): string[] {
  return AVAILABLE_MODELS.map(model => model.name);
}

/**
 * Get a list of available models with both ID and name
 * @returns Array of objects with id and name properties
 */
export function getAvailableModelsInfo(): { id: string; name: string }[] {
  return AVAILABLE_MODELS.map(model => ({
    id: model.id,
    name: model.name
  }));
}