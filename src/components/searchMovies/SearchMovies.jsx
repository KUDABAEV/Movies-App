import React from "react";
import { Input } from "antd";
import "./search-movies.css";

export default function SearchMovies({ query, updateQuery }) {
  return (
    <Input
      value={query}
      onChange={(e) => updateQuery(e.target.value)}
      placeholder="Type to search..."
    />
  );
}
