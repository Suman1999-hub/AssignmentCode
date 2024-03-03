import { useState } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function CreateScorecard() {
  const [scorecardName, setScorecardName] = useState(""); // State for scorecard name

  const [formData, setFormData] = useState({
    title: "",
    questions: [
      {
        text: "",
        options: [],
        correct: [], // Array to store string values of correct options
        score: 0,
        use_knowledge_base: false,
      },
    ],
  });

  console.log(formData);
  const [questionCounter, setQuestionCounter] = useState(2);
  const [totalScore, setTotalScore] = useState(0);

  const handleQuestionChange = (index, event) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index].text = event.target.value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = event.target.value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleCorrectOptionChange = (event,questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    const optionValue = updatedQuestions[questionIndex].options[optionIndex];
    // const isOptionAlreadyCorrect =
    //   updatedQuestions[questionIndex].correct.includes(optionValue);

    // if (isOptionAlreadyCorrect) {
    //   updatedQuestions[questionIndex].correct = updatedQuestions[
    //     questionIndex
    //   ].correct.filter((option) => option !== optionValue);
    // } else {
      //console.log(event.target.checked);
      if(event.target.checked){
        updatedQuestions[questionIndex].correct.push(optionValue);
      }
      else{
           updatedQuestions[questionIndex].correct = updatedQuestions[
              questionIndex
            ].correct.filter((option) => option !== optionValue);
            console.log(updatedQuestions[questionIndex].correct);
      }
      
    // }
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push({
      text: "",
    });
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    setQuestionCounter(questionCounter + 1); // Increment question counter
    const updatedQuestions = [
      ...formData.questions,
      {
        text: `${questionCounter}: `, // Generate question text dynamically
        options: [],
        correct: [], // Correct options should be initialized as an empty array
        score: 0,
        use_knowledge_base: false,
      },
    ];
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 0);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const updatedFormData = { ...formData, title: scorecardName };

  const handleChange = (event, questionIndex) => {
    const updatedQuestions = [...formData.questions];
    const selectedWeightage = parseInt(event.target.value);
    updatedQuestions[questionIndex].score = selectedWeightage;
    setFormData({ ...formData, questions: updatedQuestions });

    let total = 0;
    updatedQuestions.forEach((question) => {
      total += question.score;
    });
    setTotalScore(total);
  };

  const handleSaveScorecard = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/scorecards/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const dataf = await response.json();

      console.log(JSON.stringify(dataf));
      if (!response.ok) {
        throw new Error("Failed to create scorecard");
      }
      else {
        window.alert('Scorecard Save Successfully!!!');
      }

      // Redirect to the scorecards list page or show a success message
    } catch (error) {
      console.error("Error creating scorecard:", error);
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
    <>
      <List sx={style}>
        <ListItem>
        <InputBase
            sx={{
              color: "purple",
              fontSize: "1.7rem",
              fontWeight: "bold",
            }}
            fullWidth
            placeholder="Enter Scorecard Name..."
            value={scorecardName} // Set value to scorecardName
            onChange={(e) => setScorecardName(e.target.value)} // Handle scorecard name change
          />
        </ListItem>
        
          
          {formData.questions.map((question, questionIndex) => (
            
            <div key={questionIndex}>
              
              <div style={{marginLeft:"10px"}}>
                <InputBase
                  sx={{ width:"95%",fontWeight: "bold" }}
                  
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
                <div key={optionIndex}>
                  <ListItem>
                  <Checkbox
                    checked={question.correct.includes(option)}
                    onChange={(event) =>
                      handleCorrectOptionChange(event,questionIndex, optionIndex)
                    }
                    value={optionIndex}
                    name={`question-${questionIndex}`}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                  <InputBase
                    placeholder="Enter Option Text..."
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(questionIndex, optionIndex, e)
                    }
                  />
                  <IconButton
                    onClick={() =>
                      handleDeleteOption(questionIndex, optionIndex)
                    }
                    aria-label="delete-option"
                    sx={{border:"1px solid #ecefef"}}
                  >
                    <DeleteIcon />
                  </IconButton>
                  </ListItem>
                </div>
              ))}
              <ListItem>
              <div>
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
                  Add option
                </Button>
              </div>
              </ListItem>
              <ListItem>
              <div>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id={`weightage-label-${questionIndex}`}>
                    Weightage
                  </InputLabel>
                  <Select
                    labelId={`weightage-label-${questionIndex}`}
                    id={`weightage-select-${questionIndex}`}
                    value={question.score}
                    placeholder="Weightage"
                    label="Weightage"
                    onChange={(e) => handleChange(e, questionIndex)}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                  </Select>
                </FormControl>
              </div>
              </ListItem>
              <Divider variant="middle" component="li" />
            </div>
            
            
          ))}
          
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
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
              <Button
                onClick={handleSaveScorecard}
                aria-label="save-scorecard"
                style={{
                  backgroundColor: "#ecefef",
                  color: "black",
                  borderRadius: "20px",
                }}
              >
                Save Scorecard
              </Button>
            </div>
          </div>
        
        
      </List>
    </>
  );
}

export default CreateScorecard;
