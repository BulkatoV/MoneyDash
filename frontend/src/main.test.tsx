import { expect, jest, test } from '@jest/globals'

const render = jest.fn()
const createRoot = jest.fn(() => ({ render }))

jest.unstable_mockModule('react-dom/client', () => ({ createRoot }))

test('запускает React в корневом элементе страницы', async () => {
  document.body.innerHTML = '<div id="root"></div>'

  await jest.isolateModulesAsync(async () => { await import('./main') })

  expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'))
  expect(render).toHaveBeenCalledTimes(1)
})

test('пропускает запуск, если корневой элемент отсутствует', async () => {
  document.body.replaceChildren()
  createRoot.mockClear()

  await jest.isolateModulesAsync(async () => { await import('./main') })

  expect(createRoot).not.toHaveBeenCalled()
})
