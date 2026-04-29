import {useEffect, useState} from 'react';

const SEARCH_DEBOUNCE_DELAY = 500;

export function useDebouncedSearchText(searchText: string) {
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  return debouncedSearchText;
}
