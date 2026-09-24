import type { Tool } from "../tool/types";
import { checkCommand, checkPath } from "./match";
import type { Allowed, PermDecision, PermSession } from "./types";

export async function checkPermission(
  tool: Tool<any, unknown>,
  args: any,
  session: PermSession,
): Promise<Allowed> {
  const key = tool.getPermissionKey(args);
  if (key === undefined) return { ok: true };
  let decision: PermDecision;
  switch (key.kind) {
    case "command":
      decision = checkCommand(key.value, session.allowList);
      break;
    case "path":
      decision = checkPath(key.value, session.projectRoot);
      break;
    default:
      decision = "ask";
  }
  if (decision === "allowed") return { ok: true };
  // TODO: asker
  return { ok: true };
}
