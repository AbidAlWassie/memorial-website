// src/app/protesters/protesterData.ts

export const columns = [
  { label: "Name", key: "name" },
  { label: "Age", key: "age" }, // Calculated from birthdate
  { label: "Death Date", key: "deathdate" },
  { label: "Status", key: "status" },
  { label: "Hometown", key: "hometown" },
];

// Define the filters for the table
export const filters = [
  { label: "Deceased", value: "deceased" },
  { label: "Alive", value: "alive" },
];

// Search handler function
export const handleSearch = (query: string) => {
  console.log("Search query:", query);
};

// Filter change handler function
export const handleFilterChange = (filter: string) => {
  console.log("Selected filter:", filter);
  // Implement your filter logic here
};

export const calculateAge = (birthdate: string): number => {
  const birthDateObj = new Date(birthdate);
  const ageDiff = Date.now() - birthDateObj.getTime();
  const ageDate = new Date(ageDiff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const formatDate = (date: string): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
};
