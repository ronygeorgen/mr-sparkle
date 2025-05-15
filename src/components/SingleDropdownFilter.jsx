import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import debounce from "lodash.debounce";
import Transition from "../utils/Transition";

const SingleDropdownFilter = forwardRef(({
  title,
  filterOptions,
  onSearch,
  searchable = false,
  align,
  onApplyFilters = null
}, ref) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const trigger = useRef(null);
  const dropdown = useRef(null);
  const checkboxRefs = useRef({});

  // Expose reset method to parent component
  useImperativeHandle(ref, () => ({
    resetSelections: () => {
      setSelectedFilters([]);
    }
  }));

  useEffect(() => {
    filterOptions.forEach(option => {
      checkboxRefs.current[option.id] = React.createRef();
    });
  }, [filterOptions]);

  const handleClearFilters = () => {
    setSelectedFilters([]);
    onApplyFilters?.([]);
  };

  const handleApplyFilters = () => {
    onApplyFilters?.(selectedFilters);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (onSearch) onSearch(query);
    }, 500),
    [onSearch]
  );

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  // Determine if this is a KPI dropdown for custom styling
  const isKpiDropdown = title === "KPI Timeframe";

  return (
    <div className="relative inline-flex mr-2">
      <button
        ref={trigger}
        className={`btn px-3 py-1.5 ${
          isKpiDropdown 
            ? "bg-blue-50 border-blue-200 hover:border-blue-300 dark:bg-blue-900/20 dark:border-blue-700/60 dark:hover:border-blue-600 text-blue-700 dark:text-blue-300" 
            : "bg-white dark:bg-gray-800 border-gray-200 hover:border-gray-300 dark:border-gray-700/60 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300"
        } flex items-center ${
          selectedFilters.length > 0 ? "border-blue-500 text-blue-600" : ""
        }`}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="mr-2">{title}</span>
        {selectedFilters.length > 0 && (
          <span className="bg-blue-100 text-blue-600 rounded-full text-xs px-2 py-0.5 ml-1">
            {selectedFilters.length}
          </span>
        )}
        <svg className="fill-current ml-1" width="12" height="12" viewBox="0 0 12 12">
          <path d="M5.9 11.4L0.7 6.2C0.4 5.9 0.4 5.4 0.7 5.1C1 4.8 1.5 4.8 1.8 5.1L6 9.3L10.2 5.1C10.5 4.8 11 4.8 11.3 5.1C11.6 5.4 11.6 5.9 11.3 6.2L6.1 11.4C5.8 11.7 5.3 11.7 5.9 11.4Z" />
        </svg>
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className={`origin-top-right z-10 absolute top-full left-0 right-auto min-w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 pt-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
          align === "right" ? "md:left-auto md:right-0" : "md:left-0 md:right-auto"
        }`}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div ref={dropdown}>
          <div className={`text-xs font-semibold ${
            isKpiDropdown ? "text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"
          } uppercase pt-1.5 pb-2 px-3`}>
            {title}
          </div>

          {searchable && (
            <div className="px-3 pb-2">
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="w-full px-2 py-1 border rounded-md text-sm"
              />
            </div>
          )}

          <ul className="mb-4 max-h-64 overflow-y-auto">
            {filterOptions.map((option) => (
              <li key={option.id} className="py-1 px-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className={`form-checkbox ${isKpiDropdown ? "text-blue-500" : ""}`}
                    checked={selectedFilters.includes(option.id)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelectedFilters((prev) => {
                        if (isChecked) return [...prev, option.id];
                        return prev.filter((id) => id !== option.id);
                      });
                    }}
                  />
                  <span 
                    className="text-sm font-medium ml-2" 
                    title={option.description || option.label}
                  >
                    {option.label}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          <div className="py-2 px-3 border-t border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-700/20">
            <ul className="flex items-center justify-between">
              <li>
                <button
                  onClick={handleClearFilters}
                  className="btn-xs bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-red-500"
                >
                  Clear
                </button>
              </li>
              <li>
                <button
                  className={`btn-xs ${
                    isKpiDropdown 
                      ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800" 
                      : "bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                  }`}
                  onClick={handleApplyFilters}
                >
                  Apply
                </button>
              </li>
            </ul>
          </div>
        </div>
      </Transition>
    </div>
  );
});

export default SingleDropdownFilter;