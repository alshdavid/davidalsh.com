import * as mermaid from '@mermaid-js/mermaid-cli'
import { env } from 'process'
import * as puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath: env.PUPPETEER_EXECUTABLE_PATH,
  headless: 'new'
})

export function queue_mermaid(input: string) {
  const task1 = mermaid.renderMermaid(browser as any, input, 'svg', {
    backgroundColor: 'transparent',
    mermaidConfig: {
      theme: 'default'
    }
  })
  const task2 = mermaid.renderMermaid(browser as any, input, 'svg', {
    backgroundColor: 'transparent',
    mermaidConfig: {
      theme: 'dark'
    }
  })

  return [task1, task2]
}

export async function close_mermaid(): Promise<void> {
  await browser.close()
}
