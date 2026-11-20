/** @jest-environment node */

import { once } from 'node:events'
import { mkdtemp, rmdir, unlink, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterAll, expect, jest, test } from '@jest/globals'
import express from 'express'

import type { Express } from 'express'
import type { Server } from 'node:http'

const webRoot = await mkdtemp(join(tmpdir(), 'moneydash-test-'))
const index = join(webRoot, 'index.html')
const css = join(webRoot, 'test.css')
const html = '<html><body>MoneyDash test application</body></html>'
let server: Server | undefined

jest.unstable_mockModule('node:url', () => ({ fileURLToPath: () => webRoot }))

afterAll(async () => {
  jest.restoreAllMocks()

  if (server?.listening) {
    server.close()
    await once(server, 'close')
  }

  await Promise.allSettled([unlink(index), unlink(css)])
  await rmdir(webRoot)
})

test('отдаёт файлы сборки, маршруты React и ответ для неизвестного API', async () => {
  await Promise.all([writeFile(index, html), writeFile(css, 'body { color: black }')])

  const log = jest.spyOn(console, 'log').mockImplementation(() => undefined)
  const listen = jest.spyOn(express.application, 'listen').mockImplementation(function (this: Express, ...args: unknown[]): Server {
    const callback = args[2] as () => void

    server = createServer(this).listen(0, '127.0.0.1', callback)

    return server
  })

  await import('./index')
  expect(listen).toHaveBeenCalledWith(3000, '127.0.0.1', expect.any(Function))

  if (!server) throw new Error('HTTP server did not start')
  if (!server.listening) await once(server, 'listening')

  const address = server.address()

  if (!address || typeof address === 'string') throw new Error('Expected a TCP address')

  const url = `http://127.0.0.1:${address.port}`
  const [asset, page, api] = await Promise.all([
    fetch(`${url}/test.css`),
    fetch(`${url}/dashboard/demo`),
    fetch(`${url}/api/unknown`)
  ])

  expect(log).toHaveBeenCalledWith('MoneyDash: http://127.0.0.1:3000')
  expect(asset.status).toBe(200)
  expect(await asset.text()).toBe('body { color: black }')
  expect(page.status).toBe(200)
  expect(await page.text()).toBe(html)
  expect(api.status).toBe(404)
  expect(await api.json()).toEqual({ message: 'Эндпоинт не найден' })
})
