import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import GoogleSheetsTable from './GoogleSheetsTable';
import GoogleFormsEmbed from './GoogleFormEmbed';
import './App.css';
import React, { useEffect, useState } from 'react';

function NavigationBar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink to="/dublin_pub_tracker" activeClassName="active" end>Home</NavLink>
        </li>
        <li>
          <NavLink to="/dublin_pub_tracker/pubstats" activeClassName="active">Pub Stats</NavLink>
        </li>
        <li>
          <NavLink to="/dublin_pub_tracker/submission" activeClassName="active">Submit Pub Data</NavLink>
        </li>
      </ul>
    </nav>
  );
}


function Main() {
  return (
    <div>
      <h1 style={{ marginLeft: '20px', marginRight: '20px' }}>Dublin Boozer Tracker</h1>
      <div>
        <GoogleSheetsTable />
      </div>
    </div>
  );
}

function Submission() {
  return (
    <div>
      <h1>Contribute to the boozer tracker!</h1>
      <GoogleFormsEmbed />
    </div>
  );
}

function PubStats() {
  const [data, setData] = useState([]);
  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTyr_AtTh0JhgJSjN8zjvDeKnHVB7viIUHoKSzCHATSzpSZ4ECaPLGAToUFhOGORMIkDmyoEqO-5waO/pub?gid=273829997&single=true&output=csv";

  useEffect(() => {
    // Fetch data from the CSV link when the component mounts
    fetch(csvUrl)
      .then((response) => response.text())
      .then((csvData) => {
        // Parse the CSV data into an array of arrays
        const parsedData = csvData.split('\n').map((row) => row.split(','));
        setData(parsedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <h1>Pub Statistics</h1>
      <div>
        <table>
          <thead>
            <tr>
              {data.length > 0 && data[0].map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 1 && data.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/dublin_pub_tracker" element={<Main />} />
        <Route path="/dublin_pub_tracker/submission" element={<Submission />} />
        <Route path="/dublin_pub_tracker/pubstats" element={<PubStats />} />
      </Routes>
    </Router>
  );
}

export default App;
