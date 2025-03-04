import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import parseFiltersFromParams from "@/hooks/use-filters-with-apply/parse-filters-from-params/parseFiltersFromParams";
import serializeToQueryString from "@/hooks/use-filters-with-apply/serialize-to-query-string/serializeToQueryString";
import {
  ApplyFilters,
  CheckFilterActive,
  ResetFilterByKey,
  ResetFilters,
  UpdateFilterByKey
} from "@/hooks/use-filters-with-apply/useFiltersWithApply.types";

const useFiltersWithApply = <Filters extends object = Record<string, unknown>>(
  defaultFilters: Filters
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [defaultFiltersRef, setDefaultFiltersRef] = useState({
    current: defaultFilters
  });

  const { defaultActiveFilters, defaultFiltersFromParams } = useMemo(
    () => parseFiltersFromParams(defaultFiltersRef.current, searchParams),
    [defaultFiltersRef.current, searchParams]
  );

  const activeFiltersRef = useRef(defaultActiveFilters);

  const [localFilters, setLocalFilters] = useState(defaultFiltersFromParams);

  const setDefaultFilters = (defaultFilters: Filters) => {
    const { defaultFiltersFromParams } = parseFiltersFromParams(
      defaultFilters,
      searchParams
    );

    setDefaultFiltersRef({ current: defaultFilters });
    setLocalFilters(defaultFiltersFromParams);
  };

  const updateFilterByKey: UpdateFilterByKey<Filters> = (key, value) => {
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value
    }));

    activeFiltersRef.current.add(key);
  };

  const resetFilterByKey: ResetFilterByKey<Filters> = (key) => {
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      [key]: defaultFiltersRef.current[key]
    }));

    activeFiltersRef.current.delete(key);
  };

  const resetFilters: ResetFilters = () => {
    const resetFilters = {} as Filters;

    for (const key in localFilters) {
      resetFilters[key] = defaultFiltersRef.current[key];
    }

    setLocalFilters(resetFilters);
    activeFiltersRef.current.clear();
  };

  const checkFilterActive: CheckFilterActive<Filters> = (key) => {
    return activeFiltersRef.current.has(key);
  };

  const applyFilters: ApplyFilters = (options = {}) => {
    const params = new URLSearchParams(searchParams);

    for (const [filterKey, filterValue] of Object.entries(localFilters)) {
      if (checkFilterActive(filterKey as keyof Filters)) {
        params.set(filterKey, serializeToQueryString(filterValue));
      } else {
        params.delete(filterKey);
      }
    }

    if (options.additionalParams) {
      for (const [key, value] of Object.entries(options.additionalParams)) {
        params.set(key, serializeToQueryString(value));
      }
    }

    setSearchParams(params);
  };

  const appliedFilters = useMemo(() => {
    const filters = {} as Partial<Filters>;

    for (const key in defaultFiltersFromParams) {
      if (checkFilterActive(key)) {
        filters[key] = defaultFiltersFromParams[key];
      }
    }

    return filters;
  }, [defaultFiltersFromParams]);

  const activeFiltersCount = activeFiltersRef.current.size;

  return {
    filters: localFilters,
    appliedFilters,
    activeFiltersCount,
    defaultFilters: defaultFiltersRef.current,
    actions: {
      checkFilterActive,
      updateFilterByKey,
      resetFilterByKey,
      resetFilters,
      applyFilters,
      setDefaultFilters
    }
  } as const;
};

export default useFiltersWithApply;
