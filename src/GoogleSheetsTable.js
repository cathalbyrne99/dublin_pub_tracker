import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const GoogleSheetsTable = () => {
  const [data, setData] = useState([]);
  const [uniqueValues, setUniqueValues] = useState({}); // Store unique values for each column
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTyr_AtTh0JhgJSjN8zjvDeKnHVB7viIUHoKSzCHATSzpSZ4ECaPLGAToUFhOGORMIkDmyoEqO-5waO/pub?gid=0&single=true&output=csv');
      const rows = response.data.split('\n');
      const columns = rows[0].split(',');
      const cellValues = [];
      const uniqueVals = {};

      for (let i = 1; i < rows.length; i++) {
        const rowData = rows[i].split(',');
        const cellData = {};
        for (let j = 0; j < columns.length; j++) {
          cellData[columns[j]] = rowData[j];
          // Populate unique values
          if (!uniqueVals[columns[j]]) {
            uniqueVals[columns[j]] = new Set();
          }
          uniqueVals[columns[j]].add(rowData[j]);
        }
        cellValues.push(cellData);
      }

      // Convert sets to arrays
      Object.keys(uniqueVals).forEach((key) => {
        uniqueVals[key] = Array.from(uniqueVals[key]);
      });

      setData(cellValues);
      setUniqueValues(uniqueVals);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (header, value) => {
    setFilters({
      ...filters,
      [header]: value.toLowerCase(),
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <table>
        <thead>
          {/* First row for column headers */}
          <tr>
            {Object.keys(data[0]).map((header, index) => (
              <th key={index} className="thStyle">
                {header}
              </th>
            ))}
          </tr>
          {/* Second row for filters */}
          <tr>
            {Object.keys(data[0]).map((header, index) => (
              <th key={index} className="filterStyle">
                <select
                  onChange={(e) => handleFilterChange(header, e.target.value)}
                  defaultValue=""
                >
                  <option value="">All</option>
                  {uniqueValues[header].map((value, idx) => (
                    <option key={idx} value={value}>{value}</option>
                  ))}
                </select>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data
            .filter((rowData) =>
              Object.keys(filters).every((header) =>
                rowData[header].toString().toLowerCase().includes(filters[header])
              )
            )
            .map((rowData, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(rowData).map((cellValue, columnIndex) => (
                  <td key={columnIndex} className="tdStyle">
                    {cellValue}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default GoogleSheetsTable;
