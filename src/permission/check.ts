import type { Tool } from "../tool/types";
import { checkCommand, checkPath } from "./match";
import type {
  Allowed,
  Asker,
  PermDecision,
  PermSession,
  UserDecision,
} from "./types";

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
  if (userDecision === "deny") {
    return {
      ok: false,
      reason: "User denied tool use with the provided arguments",
    };
  }

  // avoid adding to session on always-ask toolCalls
  if (decision === "ask") {
    const trimmed = key.value.trim();
    if (userDecision === "allow-always-exact") {
      // add exact string to allowList
      session.allowList.push(new RegExp(`^${escapeRegex(trimmed)}$`));
    } else if (userDecision === "allow-always-prefix") {
      // add prefix * to allowList regex
      const base = trimmed.split(/\s+/)[0];
      if (base)
        session.allowList.push(new RegExp(`^${escapeRegex(base)}(\\s.*)?$`));
    }
  }
  return { ok: true };
}
