import * as vscode from "vscode";
import {
  ContextItem,
  ContextProviderDescription,
  ContextProviderExtras,
  ContextSubmenuItem,
  // CustomContextProvider,
  IContextProvider,
  LoadSubmenuItemsArgs,
  Problem,
} from "./continue";

import path from "path";
import { contextSource, msgToCode } from "./data";

export const KonveyorProvider: IContextProvider = {
  get description(): ContextProviderDescription {
    return {
      title: "Konveyor",
      displayTitle: "Konveyor",
      description: "Konveyor provider",
      type: "normal",
    };
  },

  getContextItems: async (
    query: string,
    extras: ContextProviderExtras
  ): Promise<ContextItem[]> => {
    console.log("getContextItems", query, extras);

    const ide = extras.ide;
    const problems = await ide.getProblems();

    const items = await Promise.all(
      problems
        .map((problem): [Problem, string] => [
          problem,
          msgToCode[problem.message],
        ])
        .filter(([, code]) => code)
        .map(async ([problem, code]) => {
          const content = await ide.readFile(problem.filepath);
          const lines = content.split("\n");
          const windowSize = 10;
          const rangeContent = lines
            .slice(
              Math.max(0, problem.range.start.line - windowSize),
              problem.range.end.line + windowSize
            )
            .join("\n");

          const example = contextSource[code]?.[0]?.content;

          return {
            description: "Problems in current file",
            content: `\`\`\`${path.basename(
              problem.filepath
            )}\n${rangeContent}\n\`\`\`\n${problem.message}\n
          ${example}\n
          `,
            name: `Warning in ${path.basename(problem.filepath)}`,
          };
        })
    );

    return items.length === 0
      ? [
          {
            description: "Problems in current file",
            content: "There are no problems found in the open file.",
            name: "No problems found",
          },
        ]
      : items;
  },

  loadSubmenuItems: async (
    _args: LoadSubmenuItemsArgs
  ): Promise<ContextSubmenuItem[]> => [],
};
