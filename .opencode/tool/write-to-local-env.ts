import path from "path"
import { tool } from "@opencode-ai/plugin"
import { getProjectRoot } from "../lib/surgent"

export default tool({
  description: `Write environment variables to a local .env file. Use this tool after creating a Convex project to save the deployment credentials locally.

Example usage:
- After convex create_project succeeds, call this tool with the returned credentials
- Variables will be merged with existing ones (existing values are updated, new ones are added)`,
  args: {
    vars: tool.schema.record(tool.schema.string(), tool.schema.string()).describe("Key-value pairs of environment variables to write"),
    file: tool.schema.string().optional().describe("Target env file (default: .env.local)"),
  },
  async execute(args): Promise<string> {
    try {
      const filename = args.file || ".env.local"
      const root = getProjectRoot()
      const filepath = path.join(root, filename)
      const file = Bun.file(filepath)

      // Parse existing env file if it exists
      let existing: Record<string, string> = {}
      if (await file.exists()) {
        const content = await file.text()
        for (const line of content.split("\n")) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith("#")) continue
          const eqIndex = trimmed.indexOf("=")
          if (eqIndex > 0) {
            const key = trimmed.slice(0, eqIndex)
            const value = trimmed.slice(eqIndex + 1)
            existing[key] = value
          }
        }
      }

      // Merge new variables (new values override existing)
      const merged = { ...existing, ...args.vars }

      // Build new content
      const newContent = Object.entries(merged)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n") + "\n"

      // Write file
      await Bun.write(filepath, newContent)

      const writtenKeys = Object.keys(args.vars)
      return `Successfully wrote to ${filename}:\n${writtenKeys.map(k => `  ${k}=***`).join("\n")}`
    } catch (error) {
      const err = error as Error
      return `Failed to write env file: ${err.message}`
    }
  },
})
