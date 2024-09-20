import { useState } from "react";

const useSearch = (
  initialData: Array<Record<string, any>>,
  searchKeys: string[],
) => {
  const [filteredData, setFilteredData] = useState(initialData);
  const [query, setQuery] = useState(""); // Track the search query

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery); // Update the query state

    if (!searchQuery) {
      setFilteredData(initialData);
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = initialData.filter((item) =>
      searchKeys.some((key) =>
        item[key]?.toString().toLowerCase().includes(lowercasedQuery),
      ),
    );
    setFilteredData(filtered);
  };

  return { filteredData, handleSearch, query }; // Return query so it can be checked elsewhere
};

export default useSearch;
