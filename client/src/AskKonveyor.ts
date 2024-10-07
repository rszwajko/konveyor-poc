import * as vscode from "vscode";
import { contextSource } from "./data";

class ContinueQuickFixProvider implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
    if (context.diagnostics.length === 0) {
      return [];
    }

    const diagnostic = context.diagnostics[0];

    const quickFix = new vscode.CodeAction(
      "Ask Konveyor",
      vscode.CodeActionKind.QuickFix
    );

    quickFix.isPreferred = false;

    const surroundingRange = new vscode.Range(
      Math.max(0, range.start.line - 3),
      0,
      Math.min(document.lineCount, range.end.line + 3),
      0
    );

    const code =
      typeof diagnostic?.code == "object"
        ? diagnostic?.code?.value
        : String(diagnostic?.code);
    const example = contextSource[code]?.[0]?.content;

    const message = `
    ${diagnostic.message}\n
    ${example}\n
    `;

    quickFix.command = {
      command: "continue.quickFix",
      title: "Continue Quick Fix",
      arguments: [surroundingRange, message],
    };

    return [quickFix];
  }
}

export default function registerQuickFixProvider() {
  // In your extension's activate function:
  vscode.languages.registerCodeActionsProvider(
    { language: "*" },
    new ContinueQuickFixProvider(),
    {
      providedCodeActionKinds: ContinueQuickFixProvider.providedCodeActionKinds,
    }
  );
}
