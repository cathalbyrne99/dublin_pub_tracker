import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import GoogleSheetsTable from './GoogleSheetsTable'; // Adjust the path as needed
import GoogleFormsEmbed from './GoogleFormEmbed'; // Adjust the path as needed
import './App.css'; // Import the CSS file

function Main() {
  return (
    <div>
      <h1 style={{ marginLeft: '20px', marginRight: '20px' }}>Dublin Boozer Tracker</h1>
      <div>
        <Link to="/dublin_pub_tracker/submission">
          <button className="button">Submit Pub Data</button>
        </Link>
        <GoogleSheetsTable />
      </div>
    </div>
  );
}

function Submission() {
  return (
    <div>
      <h1>Contribute to the boozer tracker!</h1>
      <Link to="/dublin_pub_tracker">
        <button className="button return">Return to Main</button>
      </Link>
      <GoogleFormsEmbed />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dublin_pub_tracker" element={<Main />} />
        <Route path="/dublin_pub_tracker/submission" element={<Submission />} />
      </Routes>
    </Router>
  );
}

export default App;
