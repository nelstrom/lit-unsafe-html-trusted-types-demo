// Minimal type declarations for Trusted Types and ShadyDOM globals
// used by lit-html source.

interface TrustedHTML {
  toString(): string;
}

interface TrustedScript {
  toString(): string;
}

interface TrustedScriptURL {
  toString(): string;
}

interface TrustedTypePolicy {
  createHTML(input: string, ...args: unknown[]): TrustedHTML;
  createScript(input: string, ...args: unknown[]): TrustedScript;
  createScriptURL(input: string, ...args: unknown[]): TrustedScriptURL;
}

interface TrustedTypePolicyFactory {
  createPolicy(
    policyName: string,
    policyOptions: {
      createHTML?: (input: string, ...args: unknown[]) => string;
      createScript?: (input: string, ...args: unknown[]) => string;
      createScriptURL?: (input: string, ...args: unknown[]) => string;
    }
  ): TrustedTypePolicy;
  isHTML(value: unknown): value is TrustedHTML;
  isScript(value: unknown): boolean;
  isScriptURL(value: unknown): boolean;
  readonly emptyHTML: TrustedHTML;
  readonly emptyScript: TrustedScript;
  readonly defaultPolicy: TrustedTypePolicy | null;
}

interface TrustedTypesWindow {
  trustedTypes: TrustedTypePolicyFactory;
}

declare global {
  interface Window {
    trustedTypes?: TrustedTypePolicyFactory;
    ShadyDOM?: {
      inUse: boolean;
      noPatch: boolean | string;
      wrap: <T extends Node>(node: T) => T;
    };
    ShadyCSS?: unknown;
    litHtmlPolyfillSupport?: unknown;
    litHtmlVersions?: string[];
    litIssuedWarnings?: Set<string | undefined>;
    emitLitDebugLogEvents?: boolean;
  }
  // eslint-disable-next-line no-var
  var litHtmlPolyfillSupport: Window['litHtmlPolyfillSupport'];
  // eslint-disable-next-line no-var
  var litHtmlVersions: Window['litHtmlVersions'];
  // eslint-disable-next-line no-var
  var litIssuedWarnings: Window['litIssuedWarnings'];
}

export {};
