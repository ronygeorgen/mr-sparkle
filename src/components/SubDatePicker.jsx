"use client"

import * as React from "react"
import { format, subDays } from "date-fns"
import { cn } from "../lib/utils"
import { Calendar } from "./ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"

const PERIOD_OPTIONS = {
  SEVEN_DAYS: 0,
  THIRTY_DAYS: 1,
  CUSTOM_RANGE: 2
}

const PERIOD_LABELS = ["Last 7 Days", "Last 30 Days", "Custom Range"]

export default function SubDatePicker({ onDateChange }) {
  const [dateRange, setDateRange] = React.useState(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedPeriod, setSelectedPeriod] = React.useState(PERIOD_OPTIONS.SEVEN_DAYS)
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef(null)

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const formatDateRange = () => {
    if (!dateRange?.from) return "Pick a date"
    if (dateRange.to) {
      return `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
    }
    return format(dateRange.from, "LLL dd, y")
  }

  const handlePeriodSelect = (periodType) => {
    setSelectedPeriod(periodType)
    setDropdownOpen(false)

    let newDateRange = null
    const today = new Date()

    switch (periodType) {
      case PERIOD_OPTIONS.SEVEN_DAYS:
        newDateRange = {
          from: subDays(today, 7),
          to: today
        }
        setIsOpen(false)
        break
      case PERIOD_OPTIONS.THIRTY_DAYS:
        newDateRange = {
          from: subDays(today, 30),
          to: today
        }
        setIsOpen(false)
        break
      case PERIOD_OPTIONS.CUSTOM_RANGE:
        setIsOpen(true)
        return
      default:
        break
    }

    setDateRange(newDateRange)
    if (onDateChange) {
      onDateChange(newDateRange)
    }
  }

  const handleCalendarSelect = (newDate) => {
    setDateRange(newDate)
    if (onDateChange) {
      onDateChange(newDate)
    }
  }

  return (
    <div className={cn("flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full justify-end")}>
      {/* Period Dropdown */}
      <div className="relative w-full sm:w-auto" ref={dropdownRef}>
        <button
          className="btn w-full sm:w-auto px-1.5 min-w-0 sm:min-w-[9rem] bg-white border-gray-200 hover:border-gray-300 dark:border-gray-700/60 dark:hover:border-gray-600 dark:bg-gray-800 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 font-medium text-left justify-between text-sm"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="flex items-center">
            <svg className="fill-current text-gray-400 dark:text-gray-500 mr-2" width="16" height="16" viewBox="0 0 16 16">
              <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z" />
              <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z" />
            </svg>
            <span>{PERIOD_LABELS[selectedPeriod]}</span>
          </div>
          <svg className="shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" width="11" height="7" viewBox="0 0 11 7">
            <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-lg shadow-lg py-1.5">
            <div className="font-medium text-sm text-gray-600 dark:text-gray-300">
              {PERIOD_LABELS.map((label, index) => (
                <button
                  key={index}
                  className={`flex items-center w-full hover:bg-gray-50 dark:hover:bg-gray-700/20 py-1 px-3 cursor-pointer ${
                    index === selectedPeriod ? 'text-violet-500' : ''
                  }`}
                  onClick={() => handlePeriodSelect(index)}
                >
                  <svg
                    className={`shrink-0 mr-2 fill-current text-violet-500 ${
                      index !== selectedPeriod && 'invisible'
                    }`}
                    width="12"
                    height="9"
                    viewBox="0 0 12 9"
                  >
                    <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28.28z" />
                  </svg>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Date Range Picker */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            id="date"
            className={cn(
              "btn w-full sm:w-auto px-1.5 min-w-0 sm:min-w-[9rem] bg-white border-gray-200 hover:border-gray-300 dark:border-gray-700/60 dark:hover:border-gray-600 dark:bg-gray-800 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 font-medium text-left justify-start text-sm",
              !dateRange && "text-muted-foreground"
            )}
          >
            <svg className="fill-current text-gray-400 dark:text-gray-500 ml-1 mr-2" width="16" height="16" viewBox="0 0 16 16">
              <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
              <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z"></path>
            </svg>
            {formatDateRange()}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleCalendarSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}