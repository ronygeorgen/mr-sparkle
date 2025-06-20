import React, { createContext, useContext, useState } from "react"
import {
  endOfToday,
  addDays,
  subDays,
} from "date-fns"

const FiscalPeriodContext = createContext()

export const useFiscalPeriod = () => useContext(FiscalPeriodContext)

// Period type constants
export const PERIOD_TYPES = {
  CUSTOM_RANGE: 0,
  LAST_7_DAYS: 1,
  MONTH_TO_DATE: 2,
  QUARTER_TO_DATE: 3,
  YEAR_TO_DATE: 4,
  NEXT_2_WEEKS: 5,
  NEXT_60_DAYS: 6,
}

// Predefined period labels (reusable across dashboards)
const periodOptions = [
  "Custom Range",
  "Last 7 Days",
  "Month to Date (MTD)",
  "Quarter to Date (QTD)",
  "Year to Date (YTD)",
  "Next 2 Weeks",
  "Next 60 Days",
]

export const FiscalPeriodProvider = ({ children }) => {
  const today = new Date()

  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(PERIOD_TYPES.LAST_7_DAYS) // Default: Last 7 Days
  const [dateRange, setDateRange] = useState({
    from: subDays(today, 6), // Last 7 days includes today
    to: today,
  })

  const calculatePredefinedRange = (index) => {
    const now = new Date()
    switch (index) {
      case PERIOD_TYPES.LAST_7_DAYS:
        return { from: subDays(now, 6), to: endOfToday() }
      case PERIOD_TYPES.MONTH_TO_DATE:
        return { from: subDays(now, 29), to: endOfToday() }
      case PERIOD_TYPES.QUARTER_TO_DATE:
        return { from: subDays(now, 89), to: endOfToday() }
      case PERIOD_TYPES.YEAR_TO_DATE:
        return { from: subDays(now, 364), to: endOfToday() }
      case PERIOD_TYPES.NEXT_2_WEEKS:
        return { from: now, to: addDays(now, 13) }
      case PERIOD_TYPES.NEXT_60_DAYS:
        return { from: now, to: addDays(now, 59) }
      default: // PERIOD_TYPES.CUSTOM_RANGE
        return dateRange
    }
  }

  const changePeriod = (index, customDate = null) => {
    setSelectedPeriodIndex(index)
    if (index === PERIOD_TYPES.CUSTOM_RANGE && customDate) {
      setDateRange(customDate)
    } else {
      setDateRange(calculatePredefinedRange(index))
    }
  }

  return (
    <FiscalPeriodContext.Provider
      value={{
        selectedPeriodIndex,
        dateRange,
        periodOptions,
        changePeriod,
      }}
    >
      {children}
    </FiscalPeriodContext.Provider>
  )
}
