
import './App.css';
import GoogleSheetsTable from './GoogleSheetsTable'; // Adjust the path as needed

function App() {
  return (
    <div>
      <h1 style={{ marginLeft: '20px', marginRight: '20px' }}>Dublin Boozer Tracker</h1>
      <GoogleSheetsTable />
    </div>
  );
}

export default App;
