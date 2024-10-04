import * as path from "path";
import * as vscode from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
  console.log('Activating extension "konveyor-poc"...');

  const disposable = vscode.commands.registerCommand(
    "konveyor-poc.helloWorld",
    () => vscode.window.showInformationMessage("Hello World from konveyor-poc!")
  );

  context.subscriptions.push(disposable);

  const serverModule = context.asAbsolutePath(
    path.join("server", "out", "server.js")
  );

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
    },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: "file", language: "plaintext" },
      { scheme: "file", language: "java" },
      { scheme: "jdt", language: "java" },
      { scheme: "untitled", language: "java" },
    ],
  };

  client = new LanguageClient(
    "konveyorPoCLanguageServer",
    "Konveyor PoC Language Server",
    serverOptions,
    clientOptions
  );

  client.start();
  console.log("Konveyor PoC is now active!");
}

export function deactivate(): Thenable<void> | undefined {
  return client?.stop();
}
