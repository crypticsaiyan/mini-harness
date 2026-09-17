import type { z, ZodRawShape } from "zod";

export type Tool<
  TParams extends ZodRawShape = ZodRawShape,
  TResult = unknown,
> = {
  name: string;
  description: string;
  parameters: z.ZodObject<TParams>;
  execute: (args: z.infer<z.ZodObject<TParams>>) => Promise<TResult>;
};
