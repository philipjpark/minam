import { z } from 'zod';

export const FeatureSpec = z.object({
  name: z.string(),
  dtype: z.enum(['string','number','datetime']).or(z.string())
});

export const ModelProfileCreate = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  features: z.array(FeatureSpec),
});

export const ProviderCreate = z.object({
  name: z.string(),
  contact_email: z.string().email(),
});

export const DatasetCreate = z.object({
  provider_id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  rows: z.array(z.any()),
});

export const PipelineRunRequest = z.object({
  dataset_id: z.string().uuid(),
  model_profile_id: z.string().uuid(),
  min_coverage: z.number().min(0).max(1).default(0.8),
});

export const ApiCreate = z.object({
  proposal_id: z.string().uuid(),
  provider_id: z.string().uuid(),
  name: z.string(),
  pricing: z.string(),
  human_approval_note: z.string().min(3),
});

export type TProviderCreate = z.infer<typeof ProviderCreate>;
export type TModelProfileCreate = z.infer<typeof ModelProfileCreate>;
export type TDatasetCreate = z.infer<typeof DatasetCreate>;
export type TPipelineRunRequest = z.infer<typeof PipelineRunRequest>;
export type TApiCreate = z.infer<typeof ApiCreate>;
