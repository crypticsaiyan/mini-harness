import type { Tool } from "../tool/types";
import { checkCommand, checkPath } from "./match";
import type {
  Allowed,
  Asker,
  PermDecision,
  PermSession,
  UserDecision,
} from "./types";

export async function checkPermission(
  tool: Tool<any, unknown>,
  args: any,
  session: PermSession,
  asker: Asker,
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
  const userDecision: UserDecision = await asker(key, decision);
  if (userDecision === "deny")
    return {
      ok: false,
      reason: "User denied tool use with the provided arguments",
    };
  if (userDecision === "allow-always") {
    // TODO: add command to session allowList
  }
  return { ok: true };
}
