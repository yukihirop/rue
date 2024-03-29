// third party
import chalk from 'chalk';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import { JSDOM } from 'jsdom';

// locals
import { prismOkaidia as color } from './themes';

// types
import type * as t from './types';

export class Generator$Definitions$Highlighter$Base {
  static SUPPORT_TOKENS = Object.keys(color);

  static highlight(sourceCode: string): string {
    const prismCode = Prism.highlight(sourceCode, Prism.languages.ts, 'ts');

    const dom = JSDOM.fragment(prismCode);
    const highlightedSource = this._parseFormatedContent(dom.childNodes, 0);

    return highlightedSource;
  }

  // https://medium.com/@stfbauer/use-prismjs-for-syntax-highlighting-in-console-log-in-nodejs-ab84b6eaa079#
  private static _parseFormatedContent(
    domElement: NodeListOf<ChildNode>,
    recLevel: number
  ): string {
    let highlightedSource = '';

    domElement.forEach((element) => {
      if (element.hasChildNodes()) {
        // @ts-ignore
        const highlighter = this._getHighlighter(element.classList);
        if (highlighter) {
          highlightedSource += highlighter(
            this._parseFormatedContent(element.childNodes, recLevel + 1)
          );
        } else {
          highlightedSource += element.textContent;
        }
      } else {
        highlightedSource += element.textContent;
      }
    });

    return highlightedSource;
  }

  private static _getHighlighter(tokens: string[]): t.Highliter {
    const supportTokens = this.SUPPORT_TOKENS;
    let highliter;

    for (let i = 0; i < tokens.length; i++) {
      if (supportTokens.indexOf(tokens[i]) !== -1) {
        const token = tokens[i];
        highliter = chalk.hex(color[token]);
        break;
      }
    }

    if (highliter) {
      return highliter;
    } else {
      return (code: string) => code;
    }
  }
}
