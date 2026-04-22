/**
 * Minimal Trusted Types and ShadyDOM type declarations for use in this demo.
 * These replace the `trusted-types` npm package types.
 */

export interface TrustedHTML {
  toString(): string;
}

export interface TrustedScript {
  toString(): string;
}

export interface TrustedScriptURL {
  toString(): string;
}

export interface TrustedTypePolicy {
  createHTML(input: string, ...args: unknown[]): TrustedHTML;
  createScript(input: string, ...args: unknown[]): TrustedScript;
  createScriptURL(input: string, ...args: unknown[]): TrustedScriptURL;
  readonly name: string;
}

export interface TrustedTypePolicyFactory {
  createPolicy(
    policyName: string,
    policyOptions?: {
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

export interface TrustedTypesWindow {
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
