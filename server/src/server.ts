/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
  createConnection,
  TextDocuments,
  Diagnostic,
  DiagnosticSeverity,
  ProposedFeatures,
  InitializeParams,
  DidChangeConfigurationNotification,
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams,
  TextDocumentSyncKind,
  InitializeResult,
  DocumentDiagnosticReportKind,
  type DocumentDiagnosticReport,
} from "vscode-languageserver/node";

import { TextDocument } from "vscode-languageserver-textdocument";

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
  const capabilities = params.capabilities;

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that this server supports code completion.
      completionProvider: {
        resolveProvider: true,
      },
      diagnosticProvider: {
        interFileDependencies: false,
        workspaceDiagnostics: false,
      },
    },
  };
  return result;
});

connection.onInitialized(() => {
  console.log("Server initialized");
});

connection.onDidChangeConfiguration((change) => {
  console.log("onDidChangeConfiguration");
  connection.languages.diagnostics.refresh();
});

documents.onDidClose((e) => {
  console.log("documents.onDidClose");
});

connection.languages.diagnostics.on(async (params) => {
  const document = documents.get(params.textDocument.uri);
  return {
    kind: DocumentDiagnosticReportKind.Full,
    items: document ? await validateTextDocument(document) : [],
  } satisfies DocumentDiagnosticReport;
});

documents.onDidChangeContent((change) => {
  console.log("documents.onDidChangeContent", change);
});

async function validateTextDocument(
  textDocument: TextDocument
): Promise<Diagnostic[]> {
  const matches = [
    ...textDocument.getText().matchAll(/\bjavax\.ejb\.Stateless\b/g),
  ];
  return matches.map((m) => {
    const range = {
      start: textDocument.positionAt(m.index),
      end: textDocument.positionAt(m.index + m[0].length),
    };
    return {
      severity: DiagnosticSeverity.Warning,
      relatedInformation: [
        {
          location: {
            uri: textDocument.uri,
            range,
          },
          message: "Spelling matters",
        },
      ],
      range,
      message: `Stateless EJBs can be converted to a CDI bean by replacing the "@Stateless"
    annotation with a scope eg "@ApplicationScoped"`,
      source: "Konveyor PoC",
    };
  });
}

connection.onDidChangeWatchedFiles((_change) => {
  connection.console.log("connection.onDidChangeWatchedFiles");
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
