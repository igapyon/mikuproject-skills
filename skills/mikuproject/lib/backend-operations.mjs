export const DEFAULT_JAVA_RUNTIME_PATH = "skills/mikuproject/runtime/mikuproject.jar";
export const DEFAULT_NODE_RUNTIME_PATH = "skills/mikuproject/runtime/mikuproject.mjs";

export const operationRegistry = {
  spec: {
    cliArgs: ["ai", "spec"],
    mcpTool: "mikuproject_ai_spec",
    requires: []
  },
  draft: {
    cliArgs: ["state", "from-draft"],
    mcpTool: "mikuproject_state_from_draft",
    requires: ["inputPath", "outputPath"]
  },
  patch: {
    cliArgs: ["state", "apply-patch"],
    mcpTool: "mikuproject_state_apply_patch",
    requires: ["statePath", "inputPath", "outputPath"]
  },
  "workbook-export": {
    cliArgs: ["export", "workbook-json"],
    mcpTool: "mikuproject_export_workbook_json",
    requires: ["inputPath", "outputPath"]
  },
  "wbs-markdown-export": {
    cliArgs: ["report", "wbs-markdown"],
    mcpTool: "mikuproject_report_wbs_markdown",
    requires: ["inputPath", "outputPath"]
  },
  "mermaid-export": {
    cliArgs: ["report", "mermaid"],
    mcpTool: "mikuproject_report_mermaid",
    requires: ["inputPath", "outputPath"]
  },
  "wbs-xlsx-export": {
    cliArgs: ["report", "wbs-xlsx"],
    mcpTool: "mikuproject_report_wbs_xlsx",
    requires: ["inputPath", "outputPath"]
  },
  "daily-svg-export": {
    cliArgs: ["report", "daily-svg"],
    mcpTool: "mikuproject_report_daily_svg",
    requires: ["inputPath", "outputPath"]
  },
  "weekly-svg-export": {
    cliArgs: ["report", "weekly-svg"],
    mcpTool: "mikuproject_report_weekly_svg",
    requires: ["inputPath", "outputPath"]
  },
  "monthly-calendar-svg-export": {
    cliArgs: ["report", "monthly-calendar-svg"],
    mcpTool: "mikuproject_report_monthly_calendar_svg",
    requires: ["inputPath", "outputPath"]
  },
  "all-report-export": {
    cliArgs: ["report", "all"],
    mcpTool: "mikuproject_report_all",
    requires: ["inputPath", "outputPath"]
  }
};

export const operationCapabilities = Object.fromEntries(
  Object.entries(operationRegistry).map(([operation, definition]) => [
    operation,
    {
      cli: Boolean(definition.cliArgs),
      mcp: Boolean(definition.mcpTool)
    }
  ])
);

export function buildCliInvocation({
  operation,
  runtime = "java",
  inputPath,
  outputPath,
  statePath,
  javaRuntimePath = DEFAULT_JAVA_RUNTIME_PATH,
  nodeRuntimePath = DEFAULT_NODE_RUNTIME_PATH
} = {}) {
  const definition = operationRegistry[operation];
  if (!definition?.cliArgs) {
    throw new Error(`unsupported CLI operation: ${operation}`);
  }

  assertRequiredFields(definition.requires, {
    inputPath,
    outputPath,
    statePath
  }, operation);

  const operationArgs = [...definition.cliArgs];
  appendPathArgs(operationArgs, {
    inputPath,
    outputPath,
    statePath
  });

  if (runtime === "java") {
    return {
      command: "java",
      args: ["-jar", javaRuntimePath, ...operationArgs]
    };
  }

  if (runtime === "node") {
    return {
      command: "node",
      args: [nodeRuntimePath, ...operationArgs]
    };
  }

  throw new Error(`unsupported CLI runtime: ${runtime}`);
}

export function getMcpToolName(operation) {
  return operationRegistry[operation]?.mcpTool ?? null;
}

function appendPathArgs(args, {
  inputPath,
  outputPath,
  statePath
}) {
  if (statePath) {
    args.push("--state", statePath);
  }
  if (inputPath) {
    args.push("--in", inputPath);
  }
  if (outputPath) {
    args.push("--out", outputPath);
  }
}

function assertRequiredFields(requiredFields, values, operation) {
  for (const field of requiredFields) {
    if (!values[field]) {
      throw new Error(`missing ${field} for operation: ${operation}`);
    }
  }
}
