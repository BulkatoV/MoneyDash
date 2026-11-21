import { useState } from 'react'

import { StatusMessage } from './StatusMessage'

import type { ChangeEvent, JSX } from 'react'

export function CsvUploadForm(): JSX.Element {
  const [file, setFile] = useState<File>()

  function selectFile(event: ChangeEvent<HTMLInputElement>): void {
    setFile(event.currentTarget.files?.[0])
  }

  return (
    <div className="upload-form">
      <label className="field-label" htmlFor="csv-file">Файл с операциями</label>
      <input id="csv-file" type="file" accept=".csv,text/csv" onChange={selectFile} aria-describedby="csv-note" />
      <p id="csv-note" className="muted">CSV в UTF-8. Обработка файла появится в MVP.</p>
      {file && <StatusMessage>Выбран файл «{file.name}».</StatusMessage>}
    </div>
  )
}
