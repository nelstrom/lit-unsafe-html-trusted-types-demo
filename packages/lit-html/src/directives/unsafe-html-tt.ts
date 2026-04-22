/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Modified version of unsafe-html.ts that integrates with Trusted Types.
 * This is a proposal/demo — not an official Lit release.
 */

import {nothing, noChange} from '../lit-html.js';
import {directive, Directive, PartInfo, PartType} from '../directive.js';
import type {ChildPart} from '../directive.js';
import type {TrustedHTML} from '../types.js';

const HTML_RESULT = 1;

export class UnsafeHTMLTTDirective extends Directive {
  static directiveName = 'unsafeHtmlTT';
  static resultType = HTML_RESULT;

  private _value: unknown = nothing;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.CHILD) {
      throw new Error(
        `${
          (this.constructor as typeof UnsafeHTMLTTDirective).directiveName
        }() can only be used in child bindings`
      );
    }
  }

  render(value: unknown) {
    if (value === nothing || value == null) {
      this._value = value;
      return value;
    }
    if (value === noChange) {
      return value;
    }

    // Case 1: Value is TrustedHTML — the proposed fix.
    // We accept it directly without going through Lit's fake-template path,
    // inserting the already-sanitized fragment via setHTMLUnsafe.
    if (
      typeof window !== 'undefined' &&
      window.trustedTypes?.isHTML(value as TrustedHTML)
    ) {
      if (value === this._value) {
        return noChange;
      }
      this._value = value;
      // Return a sentinel; real insertion happens in update()
      return noChange;
    }

    // Case 2: Plain string with Trusted Types active — enforce policy.
    if (typeof value === 'string' && typeof window !== 'undefined' && window.trustedTypes) {
      throw new Error(
        `unsafeHtmlTT() received a plain string while Trusted Types is active. ` +
          `Pass a TrustedHTML object (e.g. from DOMPurify with RETURN_TRUSTED_TYPE: true).`
      );
    }

    // Case 3: Plain string without Trusted Types — backwards compat path.
    if (typeof value !== 'string') {
      throw new Error(
        `${
          (this.constructor as typeof UnsafeHTMLTTDirective).directiveName
        }() called with a non-string value`
      );
    }
    if (value === this._value) {
      return this._templateResult;
    }
    this._value = value;
    const strings = [value] as unknown as TemplateStringsArray;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (strings as any).raw = strings;
    return (this._templateResult = {
      ['_$litType$']: (this.constructor as typeof UnsafeHTMLTTDirective)
        .resultType as 1 | 2,
      strings,
      values: [],
    });
  }

  private _templateResult?: object;

  override update(part: ChildPart, [value]: Parameters<this['render']>) {
    // Case 1: TrustedHTML — insert via setHTMLUnsafe to bypass Lit's policy.
    if (
      typeof window !== 'undefined' &&
      window.trustedTypes?.isHTML(value as TrustedHTML)
    ) {
      if (value === this._value && part._$startNode.nextSibling !== part._$endNode) {
        return noChange;
      }
      this._value = value;

      const templateEl = document.createElement('template');
      // setHTMLUnsafe accepts TrustedHTML directly — this is the safe sink.
      (templateEl as any).setHTMLUnsafe(value);
      const frag = templateEl.content.cloneNode(true) as DocumentFragment;

      // Clear existing children between marker nodes
      let child = part._$startNode.nextSibling;
      while (child && child !== part._$endNode) {
        const next = child.nextSibling;
        child.remove();
        child = next;
      }
      // Insert the new fragment.
      // _$endNode can be null (means "end of parent"), so get parentNode from
      // _$startNode instead. insertBefore(frag, null) appends, which is correct.
      part._$startNode.parentNode!.insertBefore(frag, part._$endNode ?? null);
      return noChange;
    }

    return super.update(part, [value]);
  }
}

/**
 * A proposed replacement for `unsafeHTML` that integrates with Trusted Types.
 *
 * - If Trusted Types is active: requires a `TrustedHTML` value (e.g. from
 *   DOMPurify with `RETURN_TRUSTED_TYPE: true`), and inserts it via
 *   `setHTMLUnsafe` — bypassing Lit's internal no-op `'lit-html'` policy.
 * - If Trusted Types is not active: falls back to the existing string path
 *   for backwards compatibility.
 *
 * This is a demo/proposal. In a real implementation, Lit would expose a
 * public API instead of relying on private `_$startNode`/`_$endNode` fields.
 */
export const unsafeHtmlTT = directive(UnsafeHTMLTTDirective);
