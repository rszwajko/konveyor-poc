export type ContextProviderType = "normal" | "query" | "submenu";

type ContextProviderName =
  | "diff"
  | "github"
  | "terminal"
  | "locals"
  | "open"
  | "google"
  | "search"
  | "tree"
  | "http"
  | "codebase"
  | "problems"
  | "folder"
  | "jira"
  | "postgres"
  | "database"
  | "code"
  | "docs"
  | "gitlab-mr"
  | "os"
  | "currentFile"
  | "outline"
  | "continue-proxy"
  | "highlights"
  | "file"
  | "issue"
  | "repo-map"
  | "url"
  | string;

export interface ContextProviderDescription {
  title: ContextProviderName;
  displayTitle: string;
  description: string;
  renderInlineAs?: string;
  type: ContextProviderType;
  dependsOnIndexing?: boolean;
}

export type FetchFunction = (url: string | URL, init?: any) => Promise<any>;

export interface ContextProviderExtras {
  // config: ContinueConfig;
  fullInput: string;
  // embeddingsProvider: EmbeddingsProvider;
  // reranker: Reranker | undefined;
  // llm: ILLM;
  ide: IDE;
  // selectedCode: RangeInFile[];
  fetch: FetchFunction;
}

export interface LoadSubmenuItemsArgs {
  // config: ContinueConfig;
  // ide: IDE;
  fetch: FetchFunction;
}

export interface CustomContextProvider {
  title: string;
  displayTitle?: string;
  description?: string;
  renderInlineAs?: string;
  type?: ContextProviderType;
  getContextItems(
    query: string,
    extras: ContextProviderExtras
  ): Promise<ContextItem[]>;
  loadSubmenuItems?: (
    args: LoadSubmenuItemsArgs
  ) => Promise<ContextSubmenuItem[]>;
}

export interface IContextProvider {
  get description(): ContextProviderDescription;

  getContextItems(
    query: string,
    extras: ContextProviderExtras
  ): Promise<ContextItem[]>;

  loadSubmenuItems(args: LoadSubmenuItemsArgs): Promise<ContextSubmenuItem[]>;
}

export interface ContextSubmenuItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  metadata?: any;
}

export interface ContextItemId {
  providerTitle: string;
  itemId: string;
}

export interface ContextItem {
  content: string;
  name: string;
  description: string;
  editing?: boolean;
  editable?: boolean;
  icon?: string;
}

export interface ContextItemWithId {
  content: string;
  name: string;
  description: string;
  id: ContextItemId;
  editing?: boolean;
  editable?: boolean;
  icon?: string;
}

export interface IDE {
  // getIdeInfo(): Promise<IdeInfo>;
  // getIdeSettings(): Promise<IdeSettings>;
  // getDiff(): Promise<string>;
  // isTelemetryEnabled(): Promise<boolean>;
  // getUniqueId(): Promise<string>;
  // getTerminalContents(): Promise<string>;
  // getDebugLocals(threadIndex: number): Promise<string>;
  // getTopLevelCallStackSources(
  //   threadIndex: number,
  //   stackDepth: number
  // ): Promise<string[]>;
  // getAvailableThreads(): Promise<Thread[]>;
  // listFolders(): Promise<string[]>;
  // getWorkspaceDirs(): Promise<string[]>;
  // getWorkspaceConfigs(): Promise<ContinueRcJson[]>;
  // fileExists(filepath: string): Promise<boolean>;
  // writeFile(path: string, contents: string): Promise<void>;
  // showVirtualFile(title: string, contents: string): Promise<void>;
  // getContinueDir(): Promise<string>;
  // openFile(path: string): Promise<void>;
  // runCommand(command: string): Promise<void>;
  // saveFile(filepath: string): Promise<void>;
  readFile(filepath: string): Promise<string>;
  // readRangeInFile(filepath: string, range: Range): Promise<string>;
  // showLines(
  //   filepath: string,
  //   startLine: number,
  //   endLine: number
  // ): Promise<void>;
  // showDiff(
  //   filepath: string,
  //   newContents: string,
  //   stepIndex: number
  // ): Promise<void>;
  // getOpenFiles(): Promise<string[]>;
  // getCurrentFile(): Promise<string | undefined>;
  // getPinnedFiles(): Promise<string[]>;
  // getSearchResults(query: string): Promise<string>;
  // subprocess(command: string): Promise<[string, string]>;
  getProblems(filepath?: string | undefined): Promise<Problem[]>;
  // getBranch(dir: string): Promise<string>;
  // getTags(artifactId: string): Promise<IndexTag[]>;
  // getRepoName(dir: string): Promise<string | undefined>;
  // showToast(
  //   type: ToastType,
  //   message: string,
  //   ...otherParams: any[]
  // ): Promise<any>;
  // getGitRootPath(dir: string): Promise<string | undefined>;
  // listDir(dir: string): Promise<[string, FileType][]>;
  // getLastModified(files: string[]): Promise<{ [path: string]: number }>;
  // getGitHubAuthToken(args: GetGhTokenArgs): Promise<string | undefined>;

  // // LSP
  // gotoDefinition(location: Location): Promise<RangeInFile[]>;

  // // Callbacks
  // onDidChangeActiveTextEditor(callback: (filepath: string) => void): void;
  // pathSep(): Promise<string>;
}

export interface Problem {
  filepath: string;
  range: Range;
  message: string;
}

export interface Range {
  start: Position;
  end: Position;
}

export interface Position {
  line: number;
  character: number;
}
