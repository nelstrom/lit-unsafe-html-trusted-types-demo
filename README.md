# Lit unsafeHTML + Trusted Types Demo

A proof-of-concept exploring how Lit's `unsafeHTML` directive could integrate with Trusted Types.

## The Problem

Trusted Types enforces security at **DOM injection sinks** like `innerHTML`. When you assign a plain string to `innerHTML` with Trusted Types enabled, the browser throws (or reports, in report-only mode).

But Lit has its own internal Trusted Types policy called `'lit-html'`. Here's what happens with the standard `unsafeHTML` directive:

1. You call `unsafeHTML(myString)` with a plain string
2. The directive wraps it in a fake `TemplateResult`
3. Lit's rendering machinery processes the template
4. Lit's internal `'lit-html'` policy calls `createHTML(myString)`, producing `TrustedHTML`
5. The `TrustedHTML` is assigned to `innerHTML`
6. The browser sees trusted content arriving at the sink — no violation

Your raw string never touches `innerHTML` directly. **Lit's policy launders it.**

This defeats the purpose of Trusted Types at the application level. You want to know: "Did *I* (the application author) explicitly sanitize this value?" But the browser can't answer that because Lit's policy sits between your code and the sink.

## The Key Insight

**`unsafeHTML()` is a library-level injection sink.**

It's semantically equivalent to `innerHTML` — an API whose contract is "take this string and render it as executable HTML." The fact that it's implemented in Lit rather than in the platform doesn't change what it *is*.

Since the platform can't know about library-defined sinks, the library must enforce at its own boundary. The directive *is* the sink, so the directive should enforce.

## Detecting Trusted Types Mode

Checking `window.trustedTypes` only tells you the browser supports the API — it doesn't tell you whether the site has opted into enforcement via CSP. A modern browser will have the API regardless of CSP headers.

There are three meaningful states:

| State | Description |
|-------|-------------|
| `unsupported` | Older browser, no Trusted Types API |
| `available` | API exists, but CSP hasn't enabled enforcement |
| `enforced` | CSP is actively blocking violations |

The proposed approach uses a runtime probe:

```typescript
type TrustedTypesMode = 'unsupported' | 'available' | 'enforced';

const getTrustedTypesMode = (): TrustedTypesMode => {
  if (!window.trustedTypes) {
    return 'unsupported';
  }
  try {
    document.createElement('div').innerHTML = '';
    return 'available';
  } catch {
    return 'enforced';
  }
};
```

## The Proposed Solution

The `unsafeHtmlTT` directive (in `packages/lit-html/src/directives/unsafe-html-tt.ts`) handles three cases:

1. **TrustedHTML value**: Inserts via `setHTMLUnsafe()`, bypassing Lit's template machinery entirely
2. **Plain string + Trusted Types enforced**: Throws — the caller must sanitize first
3. **Plain string + no Trusted Types**: Falls back to existing behavior for backwards compatibility

By using `setHTMLUnsafe()` directly for TrustedHTML values, the directive avoids Lit's internal policy altogether. The security decision stays at the application boundary where it belongs.

## API Contracts

| Directive | Contract |
|-----------|----------|
| `unsafeHTML()` / `unsafeHtmlTT()` | "You already made this safe" |
| `safeHTML()` (hypothetical, using `setHTML()`) | "I'll make this safe for you" |

The "unsafe" prefix means the caller bears responsibility for sanitization. A hypothetical `safeHTML()` directive could use the platform's Sanitizer API (`setHTML()`) to sanitize automatically.

## Why Directives Still Matter

Even with platform APIs like `setHTML()` and `setHTMLUnsafe()`, Lit directives add value because of a paradigm mismatch:

- **Platform APIs are imperative**: `element.setHTML(string)`
- **Lit templates are declarative**: `` html`<div>${something}</div>` ``

You can't interpolate `setHTML()` into a template — it returns `void` and operates on an existing element. Directives bridge that gap, adapting imperative DOM APIs to Lit's reactive template model.

## Running the Demo

The demo site walks through six pages showing the progression from XSS vulnerability to the proposed fix:

1. XSS Risk — `unsafeHTML` with no sanitization
2. Manual Sanitization — DOMPurify without Trusted Types
3. Trusted Types Bypass — Lit's internal policy defeats enforcement
4. TrustedHTML Breaks — passing TrustedHTML to standard `unsafeHTML` fails
5. The Proposed Fix — `unsafeHtmlTT` with DOMPurify + Trusted Types
6. Future: setHTML() — the Sanitizer API approach

**Live site:** https://nelstrom.github.io/lit-unsafe-html-trusted-types-demo/

```bash
pnpm install
pnpm dev
```

## Caveats

This demo accesses Lit's private `_$startNode` and `_$endNode` fields. A production implementation would require Lit to expose a public API for inserting fragments into a `ChildPart`.
