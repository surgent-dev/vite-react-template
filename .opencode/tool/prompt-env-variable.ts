import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Prompt the user to enter a value for an environment variable. The UI will show a popup dialog with the question. Optionally store the response as an environment variable.",
  args: {
    question: tool.schema.string().describe("The question to ask the user"),
    variable: tool.schema.boolean().optional().describe("If true, store the response as an environment variable"),
    key: tool.schema.string().optional().describe("The environment variable name to store the response (e.g., 'USER_CHOICE')"),
  },
  async execute(args): Promise<string> {
    const question = args.question?.trim()
    const variable = args.variable || false
    const key = args.key?.trim()

    if (!question) return "Error: Missing required 'question' parameter"

    // Prepare metadata that the UI can parse from the return string
    const metadata = {
      type: "prompt-env-variable",
      question,
      variable,
      key: variable && key ? key : undefined,
    }

    // Return JSON string containing both metadata and human-readable message
    // The UI will detect this tool call and show the popup
    return JSON.stringify({
      metadata,
      message: `Prompting user: ${question}${variable && key ? `\nResponse will be stored in environment variable: ${key}` : ""}`,
    })
  },
})
