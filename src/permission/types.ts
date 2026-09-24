export type PermKey = {
  kind: "command" | "path";
  value: string;
};

export type PermDecision = "allowed" | "blocked" | "ask" | "always-ask";

export type PermSession = {
  allowList: RegExp[];
  projectRoot: string;
};

export type Allowed = { ok: true } | { ok: false; reason: string };
