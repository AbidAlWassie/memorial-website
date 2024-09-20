// src/app/protesters/Protesters.tsx

"use client";

import { DataTable } from "@/components";
import useSearch from "@/hooks/useSearch";
import { useEffect, useState } from "react";
import { columns, filters, handleFilterChange } from "./protesterData";

const Protesters = () => {
  const [data, setData] = useState([]); // Data from the API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filteredData, handleSearch, query } = useSearch(data, [
    "name",
    "status",
    "age",
    "hometown",
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getPerson"); // Fetch data from the API
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();

        // Format data to include calculated age and formatted deathdate
        const formattedData = result.map((person: any) => ({
          ...person,
          age: person.birthdate ? calculateAge(person.birthdate) : "Unknown",
          deathdate: person.deathdate
            ? new Date(person.deathdate).toLocaleDateString()
            : "N/A", // Format it if needed
        }));

        setData(formattedData); // Update state with formatted data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateAge = (birthdate: string): number => {
    const birthDate = new Date(birthdate);
    const diffMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <DataTable
        columns={columns}
        data={query ? filteredData : data} // Show filteredData if a search query exists
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={filters}
      />
    </div>
  );
};

export default Protesters;
