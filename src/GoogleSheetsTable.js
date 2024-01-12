import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
const GoogleSheetsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTyr_AtTh0JhgJSjN8zjvDeKnHVB7viIUHoKSzCHATSzpSZ4ECaPLGAToUFhOGORMIkDmyoEqO-5waO/pub?gid=0&single=true&output=csv'
      );

      const rows = response.data.split('\n');
      const columns = rows[0].split(','); // Assuming the first row contains headers
      const cellValues = [];

      for (let i = 1; i < rows.length; i++) {
        const rowData = rows[i].split(',');
        const cellData = {};

        for (let j = 0; j < columns.length; j++) {
          cellData[columns[j]] = rowData[j];
        }

        cellValues.push(cellData);
      }

      setData(cellValues);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dublin Boozer Tracker</h1>
      <table>
        <thead>
          <tr>
            {Object.keys(data[0]).map((header, index) => (
              <th key={index} className="thStyle">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((rowData, rowIndex) => (
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
