import React, { createContext, useContext, useState } from "react"
import {
  startOfMonth,
  startOfQuarter,
  startOfYear,
  endOfToday,
  addDays,
  subDays,
} from "date-fns"

const FiscalPeriodContext = createContext()

export const useFiscalPeriod = () => useContext(FiscalPeriodContext)

// Predefined period labels (reusable across dashboards)
const periodOptions = [
  "Custom Range",                  // 0
  "Last 7 Days",                   // 1
  "Last 30 Days",                  // 2
  "Month to Date (MTD)",          // 3
  "Quarter to Date (QTD)",        // 4
  "Year to Date (YTD)",           // 5
  "Next 2 Weeks",                 // 6
  "Next 60 Days",                 // 7
]

export const FiscalPeriodProvider = ({ children }) => {
  const today = new Date()

  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(1) // Default: Last 7 Days
  const [dateRange, setDateRange] = useState({
    from: subDays(today, 6), // Last 7 days includes today
    to: today,
  })

  const calculatePredefinedRange = (index) => {
    const now = new Date()
    switch (index) {
      case 1: // Last 7 Days
        return { from: subDays(now, 6), to: endOfToday() }
      case 2: // Last 30 Days
        return { from: subDays(now, 29), to: endOfToday() }
      case 3: // MTD
        return { from: startOfMonth(now), to: endOfToday() }
      case 4: // QTD
        return { from: startOfQuarter(now), to: endOfToday() }
      case 5: // YTD
        return { from: startOfYear(now), to: endOfToday() }
      case 6: // Next 2 Weeks
        return { from: now, to: addDays(now, 13) }
      case 7: // Next 60 Days
        return { from: now, to: addDays(now, 59) }
      default: // 0 - Custom Range
        return dateRange
    }
  }

  const changePeriod = (index, customDate = null) => {
    setSelectedPeriodIndex(index)
    if (index === 0 && customDate) {
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
