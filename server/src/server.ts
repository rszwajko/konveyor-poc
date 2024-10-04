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
  TextDocumentSyncKind,
  DocumentDiagnosticReportKind,
  type DocumentDiagnosticReport,
} from "vscode-languageserver/node";

import { TextDocument } from "vscode-languageserver-textdocument";

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize(() => ({
  capabilities: {
    textDocumentSync: TextDocumentSyncKind.Incremental,
    diagnosticProvider: {
      interFileDependencies: false,
      workspaceDiagnostics: false,
    },
  },
}));

connection.onInitialized((params) => {
  console.log("Server initialized", params);
});

connection.onDidChangeConfiguration((change) => {
  console.log("onDidChangeConfiguration", change);
  connection.languages.diagnostics.refresh();
});

documents.onDidClose((e) => {
  console.log("documents.onDidClose", e);
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

documents.listen(connection);
connection.listen();
