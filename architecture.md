# Архитектура MoneyDash

MoneyDash — веб-дашборд для анализа доходов и расходов. В текущей версии пользователь может выбрать CSV и изучить сводку на демонстрационных данных. Сценарий импорта и анализа пользовательских операций описан в [mvp.md](mvp.md).

## Структура проекта

В корне находятся два проекта: `frontend` и `ui-library`. Корневой `package.json` связывает их через npm workspaces. `frontend` включает браузерный интерфейс и серверную часть MoneyDash. Сервер расположен в `frontend/server/` и запускается в Node.js.

```text
moneydash/
  .gitignore
  README.md
  architecture.md
  mvp.md
  package.json
  package-lock.json
  eslint.config.js
  images/
    dashboard.png
    import.png
  frontend/
    package.json
    eslint.config.js
    jest.config.ts
    tsconfig.json
    tsconfig.server.json
    index.html
    vite.config.ts
    server/
      index.ts
      index.test.ts
    src/
      main.tsx
      main.test.tsx
      router.tsx
      router.test.tsx
      setupTests.ts
      pages/
        ImportPage.tsx
        DashboardPage.tsx
        NotFoundPage.tsx
      components/
        AppLayout.tsx
        CsvUploadForm.tsx
        DashboardFilters.tsx
        MonthlyTotalsChart.tsx
        SpendingByCategoryChart.tsx
        StatusMessage.tsx
      demo/
        transactions.ts
      styles/
        dashboard.css
      types/
        analytics.ts
  ui-library/
    package.json
    eslint.config.js
    jest.config.ts
    tsconfig.json
    vite.config.ts
    src/
      index.ts
      Chart/
        Chart.tsx
        Chart.css
      MetricCard/
        MetricCard.tsx
        MetricCard.css
      tests/
        Chart.test.tsx
        MetricCard.test.tsx
```

- `frontend` — страницы, фильтры, стили и типы финансовой сводки в `src/`. Сервер в `server/` обслуживает интерфейс и будет отвечать за импорт, агрегацию и хранение наборов в памяти процесса.
- `ui-library` — библиотека `@moneydash/ui-library` с компонентами `MetricCard` и `Chart`. `src/index.ts` задаёт публичный экспорт. Библиотека собирается в ES-модуль с декларациями TypeScript и общим CSS. React и React DOM подключаются как peer-зависимости.

В дереве показаны файлы репозитория. Git игнорирует установленные зависимости `node_modules`, сборки `dist` и `dist-server`, а также отчёты `coverage`.

## Список используемых библиотек

В таблице указаны диапазоны версий. Установленные версии зафиксированы в `package-lock.json`.

| Среда или пакет | Версия | Назначение |
| --- | --- | --- |
| Node.js | 24.x LTS | Запуск сервера и инструментов разработки |
| npm | 11.x | Установка зависимостей и управление workspaces |
| TypeScript | 5.9.x | Типизация приложения, сервера и библиотеки |
| React, React DOM | 19.2.x | Интерфейс и общие UI-компоненты |
| `react-router` | 7.x | Вложенные маршруты и параметры URL |
| Vite, `@vitejs/plugin-react` | 7.x, 5.x | Разработка и сборка приложения и UI-библиотеки |
| Express | 5.2.x | Выдача собранного интерфейса и основа для HTTP API |
| Papa Parse | 5.5.x | Разбор CSV на сервере в MVP |
| `vite-plugin-dts` | 5.x | Генерация деклараций TypeScript для `ui-library` |
| ESLint, `@eslint/js`, `typescript-eslint`, `@typescript-eslint/eslint-plugin` | 9.x, 9.x, 8.x, 8.x | Базовые правила и проверка TypeScript |
| `eslint-plugin-import`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals` | 2.x, 7.x, 7.x, 0.5.x, 17.x | Проверка импортов, React и хуков, настройка глобальных переменных |
| Jest, `@jest/globals`, `jest-environment-jsdom`, `ts-jest`, `ts-node`, `identity-obj-proxy` | 30.x, 30.x, 30.x, 29.4.x, 10.9.x, 3.x | Тесты и покрытие, преобразование TS и TSX, загрузка TS-конфигурации Jest, обработка CSS-импортов в тестах |
| `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom` | 16.x, 10.x, 6.x | Тестирование поведения компонентов и проверка DOM |
| `@types/node`, `@types/react`, `@types/react-dom`, `@types/express`, `@types/papaparse`, `@types/jest` | 24.x, 19.x, 19.x, 5.x, 5.3.x, 30.x | Типы среды, зависимостей и тестов |

## Список разрабатываемых компонентов

| Компонент приложения | Назначение |
| --- | --- |
| `AppLayout` | Общий макет страниц и ссылка на импорт |
| `ImportPage` | Подсказка о формате CSV и форма загрузки |
| `CsvUploadForm` | Выбор CSV и показ имени выбранного файла |
| `DashboardPage` | Показ сводки, карточек, фильтров и графиков по демонстрационным операциям |
| `DashboardFilters` | Выбор периода и категории операций, сброс фильтров |
| `MonthlyTotalsChart` | Подготовка двух рядов данных для общего `Chart`: доходы и расходы по месяцам |
| `SpendingByCategoryChart` | Подготовка данных для столбчатого `Chart`: суммы расходов по категориям |
| `StatusMessage` | Сообщения о выборе файла, ошибке фильтра и пустой выборке |
| `NotFoundPage` | Сообщение о неизвестном адресе и ссылка на импорт |

| Компонент `ui-library` | Назначение |
| --- | --- |
| `MetricCard` | Карточка с заголовком, значением и необязательным процентом изменения. В дашборде показывает суммы в рублях |
| `Chart` | Адаптивный SVG-график с двумя рядами и легендой для линейного режима, столбчатым режимом и подсказками по значениям |

## Структура роутинга

Все страницы вложены в корневой маршрут с макетом `AppLayout`.

| Путь | Страница | Поведение |
| --- | --- | --- |
| `/` | `ImportPage` | Индексный маршрут с выбором CSV и ссылкой на демонстрационный дашборд |
| `/dashboard/:importId` | `DashboardPage` | `demo` открывает демонстрационный набор. Для других значений показывается сообщение о недоступном наборе. Параметры `from`, `to` и `category` задают фильтры |
| `*` | `NotFoundPage` | Обработка неизвестных адресов |

Все маршруты доступны без авторизации.

## Использование библиотеки общих компонентов в основном приложении

`frontend` подключает `@moneydash/ui-library` как зависимость и загружает её стили из `@moneydash/ui-library/style.css`. На `DashboardPage` компонент `MetricCard` показывает суммы доходов, расходов и разницу. Компоненты `MonthlyTotalsChart` и `SpendingByCategoryChart` передают данные для отрисовки в `Chart`.
