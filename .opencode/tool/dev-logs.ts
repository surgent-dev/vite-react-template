import path from "path"
import { tool } from "@opencode-ai/plugin"
import {
  type SurgentConfig,
  getNameFromSurgent,
  getProjectRoot,
  readJsonIfExists,
  runShellOutput,
} from "../lib/surgent"

export default tool({
  description:
    "Show the last N lines of dev server/browser logs to see the errors. Use this tool to debug and analyze the errors. Args: lines (default 20) to specify the number of lines to show.",
  args: { lines: tool.schema.number().optional() },
  async execute(args): Promise<string> {
    try {
      const root = getProjectRoot()
      const cfg = await readJsonIfExists<SurgentConfig>(path.join(root, "surgent.json"))
      const name = getNameFromSurgent(cfg)
      const lines = args.lines ?? 20
      const out = await runShellOutput(`pm2 logs ${name} --lines ${lines} --nostream`, root)
      return out
    } catch (error) {
      return `Log fetch failed: ${(error as Error).message} JSON: ${JSON.stringify(error)}`
    }
  },
})
