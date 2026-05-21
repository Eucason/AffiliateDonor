interface AdminDateRangePickerProps {
  startDate: string
  endDate: string
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
}

export default function AdminDateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: AdminDateRangePickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm font-medium text-gray-700">
        From
        <input
          type="date"
          value={startDate}
          onChange={(event) => onStartDateChange(event.target.value)}
          className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="text-sm font-medium text-gray-700">
        To
        <input
          type="date"
          value={endDate}
          onChange={(event) => onEndDateChange(event.target.value)}
          className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
    </div>
  )
}
