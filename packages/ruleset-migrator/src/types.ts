/// <reference lib="dom" />

import type { Tree } from './tree';
import type { ExpressionKind } from 'ast-types/gen/kinds';

export type Fetch = Window['fetch'] | typeof import('@stoplight/spectral-runtime').fetch;

export type GlobalModules = Readonly<
  Record<'rulesets' | 'functions' | 'formats', Readonly<Record<string, Record<string, unknown>>> | null>
>;

export type MigrationOptions = Readonly<{
  fs: Readonly<{
    promises: Readonly<{
      readFile: typeof import('fs').promises.readFile;
    }>;
  }>;
  fetch?: Fetch;
  modules?: Partial<GlobalModules>;
}> &
  (
    | {
        format?: 'esm';
        npmRegistry?: string;
      }
    | {
        format?: 'commonjs';
        npmRegistry?: never;
      }
  );

export type Hook<T = any> = [
  pattern: RegExp,
  guard: (value: unknown) => value is T,
  hook: (input: T, ctx: TransformerCtx) => Promise<ExpressionKind | null | void> | ExpressionKind | null | void,
];

export type Transformer = (hooks: Set<Hook>) => void;

export type TransformerCtx = {
  readonly tree: Tree;
  readonly opts: MigrationOptions & {
    fetch: Fetch;
  };
  readonly hooks: Set<Hook>;
  readonly cwd: string;
  readonly filepath: string;
  readonly npmRegistry: string | null;
  read(filepath: string, fs: MigrationOptions['fs'], fetch: Fetch): Promise<unknown>;
};
