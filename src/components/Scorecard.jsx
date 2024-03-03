import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, List, ListItem, ListItemText } from '@mui/material';

function Scorecard() {
  const [scorecards, setScorecards] = useState([]);

  useEffect(() => {
    fetchScorecards();
  }, []);

  const fetchScorecards = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/scorecards/');
      if (!response.ok) {
        throw new Error('Failed to fetch scorecards');
      }
      const data = await response.json();
      setScorecards(data);
    } catch (error) {
      console.error('Error fetching scorecards:', error);
    }
  };

  // Function to render the list of scorecards
  const renderScorecards = () => {
    return (
      <List>
        {scorecards.map(scorecard => (
          <ListItem key={scorecard.id}>
            <ListItemText primary={scorecard.title} />
            <Button component={Link} to={`/edit/${scorecard.id}`} variant="outlined" color="primary">Edit</Button>
            <Button onClick={() => handleDeleteScorecard(scorecard.id)} variant="outlined" color="secondary">Delete</Button>
          </ListItem>
        ))}
      </List>
    );
  };

  const handleDeleteScorecard = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/scorecards/${id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete scorecard');
      }
      // Remove the deleted scorecard from the state
      setScorecards(scorecards.filter(scorecard => scorecard.id !== id));
    } catch (error) {
      console.error('Error deleting scorecard:', error);
    }
  };

  return (
    <div>
      <h1>Scorecard List</h1>
      <Button component={Link} to="/create" variant="contained" color="primary">Create Scorecard</Button>
      {/* Render the list of scorecards */}
      {renderScorecards()}
    </div>
  );
}

export default Scorecard;
