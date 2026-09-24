import type { z, ZodRawShape } from "zod";
import type { Asker, PermKey } from "../permission/types";
import type { Session } from "../session";

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
  execute: (
    args: z.infer<z.ZodObject<TParams>>,
    signal: AbortSignal,
  ) => Promise<TResult>;
};

export type ToolContext = {
  session: Session;
  asker: Asker;
  signal: AbortSignal;
};
