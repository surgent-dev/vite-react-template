import path from "path"
import { tool } from "@opencode-ai/plugin"
import {
  type SurgentConfig,
  getNameFromSurgent,
  getProjectRoot,
  readJsonIfExists,
  runShell,
  startOrRestartPm2Process,
} from "../lib/surgent"

export default tool({
  description: "Ensures the development server is running. Runs if dev server is not already running.",
  args: {},
  async execute(): Promise<string> {
    try {
      const root = getProjectRoot()
      const cfg = await readJsonIfExists<SurgentConfig>(path.join(root, "surgent.json"))
      const dev = cfg?.scripts?.dev
      const lint = cfg?.scripts?.lint
      if (!dev) throw new Error('Missing "scripts.dev" in surgent.json')

      const steps: string[] = []

      if (lint) {
        await runShell(lint, root)
        steps.push("Ran lint")
      }

      const commands = Array.isArray(dev) ? dev : [dev]
      const configuredName = getNameFromSurgent(cfg)

      for (let i = 0; i < commands.length; i++) {
        const name = commands.length > 1 ? `${configuredName}:${i + 1}` : configuredName
        const action = await startOrRestartPm2Process(name, commands[i], root)
        steps.push(`PM2 ${action}`)
      }

      steps.push("Done")
      return steps.join("\n")
    } catch (error) {
      const err = error as Error
      return `Failed error message: ${err.message}\n${err.stack?.toString()}`
    }
  },
})
