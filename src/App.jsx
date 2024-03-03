import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Scorecard from './components/Scorecard';
import CreateScorecard from './components/CreateScorecard';
import EditScorecard from './components/EditScorecard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Scorecard />} /> {/* Render Scorecard component at '/' */}
        <Route path="/create" element={<CreateScorecard />} /> {/* Render CreateScorecard component at '/create' */}
        <Route path="/edit/:id" element={<EditScorecard />} /> {/* Render EditScorecard component at '/edit/:id' */}
      </Routes>
    </Router>
  );
}

export default App;
