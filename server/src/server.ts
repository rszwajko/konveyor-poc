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
      code: "ee-to-quarkus-00000",
      codeDescription: {
        href: "https://github.com/konveyor/rulesets/blob/main/default/generated/quarkus/200-ee-to-quarkus.windup.yaml",
      },
      // relatedInformation: [
      //   {
      //     location: {
      //       uri: textDocument.uri,
      //       range,
      //     },
      //     message: "Spelling matters",
      //   },
      // ],
      range,
      message:
        // original message from the rule
        // usually nice speech but inaccurate code changes
        `Stateless EJBs can be converted to a CDI bean by replacing the "@Stateless" annotation with a scope eg "@ApplicationScoped"`,
      // provide package details
      // code changes correct but contain some random code
      // `Stateless EJBs can be converted to a CDI bean by replacing the "@Stateless" annotation with a scope eg "jakarta.enterprise.context.ApplicationScoped".`,
      // message with code sample
      // limited and correct change
      //   `Stateless EJBs can be converted to a CDI bean by replacing the "@Stateless" annotation with a scope eg "@ApplicationScoped".
      //  Example with conversion to "@ApplicationScoped":
      //  \`\`\`
      //  - import javax.ejb.Stateless;
      //  + import jakarta.enterprise.context.ApplicationScoped;

      //  - @Stateless
      //  + @ApplicationScoped
      //  public class Bar {
      //  \`\`\`
      //  `,
      source: "Konveyor PoC",
    };
  });
}

connection.onDidChangeWatchedFiles((_change) => {
  connection.console.log("connection.onDidChangeWatchedFiles");
});

documents.listen(connection);
connection.listen();
