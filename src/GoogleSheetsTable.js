import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const GoogleSheetsTable = () => {
  const [data, setData] = useState([]);
  const [uniqueValues, setUniqueValues] = useState({}); // Store unique values for each column
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  // Count of Pubs and Submissions
  const [numOfPubs, setNumOfPubs] = useState(0);
  const [numOfToBeApprovedSubmissions, setNumOfToBeApprovedSubmissions] = useState(0);
  const [numOfTotalSubmissions, setNumOfTotalSubmissions] = useState(0);
  const cathalsTable = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTyr_AtTh0JhgJSjN8zjvDeKnHVB7viIUHoKSzCHATSzpSZ4ECaPLGAToUFhOGORMIkDmyoEqO-5waO/pub?gid=1574508462&single=true&output=csv'

  useEffect(() => {
    fetchNumbers();
    fetchData();
  }, []);

  const fetchNumbers = async () => {
    try {
      const response = await axios.get(cathalsTable);

      // Parse the CSV data
      // Cathal TODO: Clean the fuck out of this bit once it's working
      const rows = response.data.split('\n');
      const row1 = rows[0].split(','); // Assuming the CSV has a single row of values
      const row2 = rows[1].split(','); // Assuming the CSV has a single row of values
      const row3 = rows[2].split(','); // Assuming the CSV has a single row of values


      // Extracting values from cells K1 and K2
      const pubsValue = row1[10]; // Assuming K1 is the 11th column (zero-based index)
      const totalSubmissionsValue = row2[10]; // Assuming K2 is the 12th column (zero-based index)
      const toBeAapprovedSubmissionsValue = row3[10]; // Assuming K2 is the 12th column (zero-based index)
      
      setNumOfPubs(pubsValue);
      setNumOfToBeApprovedSubmissions(toBeAapprovedSubmissionsValue);
      setNumOfTotalSubmissions(totalSubmissionsValue)
    } catch (error) {
      console.error('Error fetching numbers:', error);
    }
  };


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
      {/* Display the numbers above the table */}
      <div>
        <p style={{ marginLeft: '20px', marginRight: '20px' }}>Count of Pubs: {numOfPubs}</p>
        <p style={{ marginLeft: '20px', marginRight: '20px' }}>Total Submissions: {numOfTotalSubmissions}</p>
        <p style={{ marginLeft: '20px', marginRight: '20px' }}>Total Submissions to be Approved: {numOfToBeApprovedSubmissions}</p>
      </div>


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
