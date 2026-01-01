import path from "path"
import { tool } from "@opencode-ai/plugin"
import { getProjectRoot } from "../lib/surgent"
import { $ } from "bun"

export default tool({
  description:
    "Download a file from a URL and save it to the project. Use for downloading images, assets, or files. targetPath is relative to project root (e.g. 'public/logo.png', 'src/assets/image.jpg'). Do NOT use absolute paths.",
  args: {
    sourceUrl: tool.schema.string(),
    targetPath: tool.schema.string(),
  },
  async execute(args): Promise<string> {
    try {
      const sourceUrl = args.sourceUrl?.trim()
      const targetPath = args.targetPath?.trim()

      if (!sourceUrl) return "Missing sourceUrl"
      if (!targetPath) return "Missing targetPath"
      if (path.isAbsolute(targetPath)) return "targetPath must be relative to the project root"

      const root = getProjectRoot()
      const fullPath = path.join(root, targetPath)
      await $`curl -L --create-dirs -o ${fullPath} ${sourceUrl}`

      return `Downloaded ${sourceUrl} to ${targetPath}`
    } catch (error) {
      const err = error as Error
      return `Download failed: ${err.message}`
    }
  },
})
