import type { z, ZodRawShape } from "zod";
import type { PermKey } from "../permission/types";

export type Tool<
  TParams extends ZodRawShape = ZodRawShape,
  TResult = unknown,
> = {
  name: string;
  description: string;
  parameters: z.ZodObject<TParams>;
  getPermissionKey: (
    args: z.infer<z.ZodObject<TParams>>,
  ) => PermKey | undefined;
  execute: (args: z.infer<z.ZodObject<TParams>>) => Promise<TResult>;
};
