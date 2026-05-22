type CsvValue = string | number | boolean | null | undefined

export interface CsvColumn<T> {
  header: string
  value: (row: T) => CsvValue
}

export function buildCsv<T>(rows: T[], columns: CsvColumn<T>[]) {
  const header = columns.map((column) => escapeCsvValue(column.header)).join(',')
  const body = rows.map((row) =>
    columns.map((column) => escapeCsvValue(column.value(row))).join(','),
  )

  return [header, ...body].join('\n')
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapeCsvValue(value: CsvValue) {
  const normalized = value == null ? '' : String(value)
  const escaped = normalized.replace(/"/g, '""')

  if (/[",\n\r]/.test(escaped)) {
    return `"${escaped}"`
  }

  return escaped
}
