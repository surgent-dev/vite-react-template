import path from "path"
import { fileURLToPath } from "url"
import { $ } from "bun"

export type SurgentConfig = {
  name?: string
  scripts?: {
    dev?: string | string[]
    lint?: string
  }
}

export function getProjectRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(here, "..", "..")
}

export async function readJsonIfExists<T>(filePath: string): Promise<T | undefined> {
  try {
    const text = await Bun.file(filePath).text()
    return JSON.parse(text) as T
  } catch {
    return undefined
  }
}

export function getNameFromSurgent(cfg: SurgentConfig | undefined): string {
  const direct = cfg?.name?.trim()
  if (!direct) throw new Error('Missing "name" in surgent.json')
  return direct
}

export async function pm2JList(cwd: string): Promise<any[]> {
  try {
    const result = await $`pm2 jlist`.cwd(cwd).quiet().json()
    return Array.isArray(result) ? result : []
  } catch {
    return []
  }
}

export async function isPm2Online(name: string, cwd: string): Promise<boolean> {
  const list = await pm2JList(cwd)
  const proc = list.find((p: any) => p?.name === name)
  const status = proc?.pm2_env?.status
  return status === "online"
}

export async function startOrRestartPm2Process(
  name: string,
  command: string,
  cwd: string,
): Promise<string> {
  const online = await isPm2Online(name, cwd)
  if (online) {
    return `already online ${name}`
  }
  await $`${{ raw: `pm2 start "${command}" --name ${name}` }}`.cwd(cwd)
  return `started ${name}`
}

export async function runShell(command: string, cwd: string): Promise<void> {
  await $`${{ raw: command }}`.cwd(cwd)
}

export async function runShellOutput(command: string, cwd: string): Promise<string> {
  return await $`${{ raw: command }}`.cwd(cwd).text()
}
