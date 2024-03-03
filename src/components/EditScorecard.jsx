import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  InputBase,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  List,
  ListItem,
  Divider,
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function EditScorecard() {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [scorecardName, setScorecardName] = useState('');
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const fetchScorecard = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/scorecards/${id}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch scorecard');
        }
        const data = await response.json();
        setFormData(data);
        setScorecardName(data.title);
        calculateTotalScore(data.questions);
      } catch (error) {
        console.error('Error fetching scorecard:', error);
      }
    };
    fetchScorecard();
  }, [id]);

  const calculateTotalScore = (questions) => {
    let total = 0;
    questions.forEach((question) => {
      total += question.score;
    });
    setTotalScore(total);
  };

  const handleQuestionChange = (index, event) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index].text = event.target.value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex].text = event.target.value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push({ text: '' });
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    const updatedQuestions = [...formData.questions, { text: '', options: [], score: 0 }];
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleDeleteQuestion = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(questionIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleChange = (event, questionIndex) => {
    const updatedQuestions = [...formData.questions];
    const selectedWeightage = parseInt(event.target.value);
    updatedQuestions[questionIndex].score = selectedWeightage;
    setFormData({ ...formData, questions: updatedQuestions });
    calculateTotalScore(updatedQuestions);
  };

  const handleCorrectOptionChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    const question = updatedQuestions[questionIndex];
    const option = question.options[optionIndex];

    // Toggle the correctness of the option
    if (question.correct.includes(option)) {
      // If the option is already marked as correct, remove it
      question.correct = question.correct.filter((correctOption) => correctOption !== option);
    } else {
      // If the option is not marked as correct, add it
      question.correct.push(option);
    }

    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleSaveScorecard = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/scorecards/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
      else{
        window.alert('Scorecard Save Successfully!!!');
      }
      // Redirect to the scorecards list page or show a success message
    } catch (error) {
      console.error('Error saving scorecard:', error);
    }
  };
  const style = {
    width: '100%',
    maxWidth: "90%",
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    margin:"auto",
    backgroundColor: 'background.paper',
  };  
  return (
    <div>
      <List sx={style}>
      <ListItem>
      <InputBase
        sx={{
          color: 'purple',
          fontSize: '1.7rem',
          fontWeight: 'bold',
        }}
        placeholder="Enter Scorecard Name..."
        value={scorecardName}
        onChange={(e) => setScorecardName(e.target.value)}
      />
      </ListItem>
      
        {formData &&
          formData.questions.map((question, questionIndex) => (
            <div key={questionIndex}>
              <div style={{marginLeft:"10px"}}>
              
                <InputBase
                  sx={{ width: '95%', fontWeight: 'bold' }}
                  placeholder="Enter Question Text..."
                  value={question.text}
                  onChange={(e) => handleQuestionChange(questionIndex, e)}
                />
                <IconButton
                  onClick={() => handleDeleteQuestion(questionIndex)}
                  aria-label="delete-question"
                  sx={{border:"1px solid #ecefef"}}
                >
                  <DeleteIcon />
                </IconButton>
              
                </div>
              {question.options.map((option, optionIndex) => (
                <ListItem key={optionIndex}>
                  <Checkbox
                    checked={question.correct && question.correct.includes(option)}
                    onChange={() => handleCorrectOptionChange(questionIndex, optionIndex)}
                    value={optionIndex}
                    name={`question-${questionIndex}`}
                  />
                  <InputBase
                    placeholder="Enter Option Text..."
                    value={option}
                    onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)}
                  />
                  <IconButton
                    onClick={() => handleDeleteOption(questionIndex, optionIndex)}
                    aria-label="delete-option"
                    sx={{border:"1px solid #ecefef"}}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
              <ListItem>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddOption(questionIndex)}
                  aria-label="add-option"
                  style={{
                    backgroundColor: "#ecefef",
                    color:"black",
                    borderRadius: "20px",
                    border:"1px solid #ecefef"
                  }}
                >
                  Add Option
                </Button>
              </ListItem>
              <ListItem>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel >Weightage</InputLabel>
                  <Select
                  labelId={`weightage-label-${questionIndex}`}
                  id={`weightage-select-${questionIndex}`}
                  label="Weightage"
                    value={question.score}
                    onChange={(e) => handleChange(e, questionIndex)}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
              <Divider variant="middle" />
            </div>
          ))}
      </List>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Total Score: {totalScore}
        </Typography>
        <div>
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddQuestion}
            disabled={totalScore >= 100}
            style={{
              backgroundColor: "#ecefef",
              color: "black",
              margin: "5px",
              borderRadius: "20px",
            }}
            aria-label="add-question"
          >
            Add Question
          </Button>
          <Button onClick={handleSaveScorecard} aria-label="save-scorecard"
                style={{
                  backgroundColor: "#ecefef",
                  color: "black",
                  borderRadius: "20px",
                }}>Save Scorecard</Button>
        </div>
      </div>
    </div>
  );
}

export default EditScorecard;
