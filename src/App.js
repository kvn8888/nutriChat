import { useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showProgress, setShowProgress] = useState(false);

  const [nutrition, setNutrition] = useState({
    Calories: 0,
    Carbs: 0,
    Fats: 0,
    Protein: 0,
  });

  const [goals, setGoals] = useState({
    Calories: null,
    Carbs: null,
    Fats: null,
    Protein: null,
  });

  
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-instruct',
      messages: [
        {
          role: 'system',
          content: 'Only respond in JSON. The JSON will have attributes of Calories, Carbs, Fats, Protein ONLY. All four of these attributes. You **must** assign values to any object. NEVER OUTPUT ANYTHING OUTSIDE THE THREE ATTRIBUTES INSIDE THE JSON. **Important**: Once you have finished outputting JSON, end the response immediately, NEVER PUT UNITS!!!!!!!!!!!!! And dont make multiple JSON objects, only one!'
        },
        {role: 'user', content: message}
      ]
    })
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  }

  const handleChangeApiKey = (event) => {
    setApiKey(event.target.value);
  }

  const handleButtonPress = () => {
    fetch('https://api.perplexity.ai/chat/completions', options)
      .then(response => {
        console.log(response); // Log the raw response
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setResponse(data);
        // Assume data.choices[0].message.content is JSON with Calories, Carbs, Fats, Protein
        const content = JSON.parse(data.choices[0].message.content.match(/\{[\s\S]*?\}/g)[0]);
        setNutrition(content); // Update state with new nutritional values
      })
      .catch(err => console.error(err));
  }

  const handleGoalChange = (event) => {
    const { name, value } = event.target;
    setGoals((prevGoals) => ({
      ...prevGoals,
      [name]: value,
    }));
  };

  const handleSubmitGoals = () => {
    // Hide the goal input fields and show the progress bars
    setShowProgress(true);
  };
  

  return(
    <div className='App'>
      <h1>NutriChat</h1>
      <h3>Type in a query, and see some macro nutrients!</h3>
      {!showProgress && (
        <div className="goals">
          <input type="number" name="Calories" placeholder="Goal Calories" value={goals.Calories} onChange={handleGoalChange} />
          <input type="number" name="Carbs" placeholder="Goal Carbs (g)" value={goals.Carbs} onChange={handleGoalChange} />
          <input type="number" name="Fats" placeholder="Goal Fats (g)" value={goals.Fats} onChange={handleGoalChange} />
          <input type="number" name="Protein" placeholder="Goal Protein (g)" value={goals.Protein} onChange={handleGoalChange} />
          <button onClick={handleSubmitGoals}>Submit Goals</button>
        </div>
      )}
      {showProgress && (
        <div>
          <ProgressBar variant="success" now={nutrition.Calories} max={goals.Calories} label={`Calories: ${nutrition.Calories}/${goals.Calories}`} />
          <ProgressBar variant="info" now={nutrition.Carbs} max={goals.Carbs} label={`Carbs: ${nutrition.Carbs}g/${goals.Carbs}g`} />
          <ProgressBar variant="warning" now={nutrition.Fats} max={goals.Fats} label={`Fats: ${nutrition.Fats}g/${goals.Fats}g`} />
          <ProgressBar variant="danger" now={nutrition.Protein} max={goals.Protein} label={`Protein: ${nutrition.Protein}g/${goals.Protein}g`} />
        </div>
      )}
      {/* {response ? <p>{response.choices[0].message.content}</p>: <p></p>} */}
      <br></br>
  
      <p></p>

      {!apiKey ? 
      <input type="text" placeholder="Enter API key" value={apiKey} onChange={handleChangeApiKey}/> 
      : <div>
          <input type="text" value={message} onChange={(handleChange)}/>
          <button onClick={handleButtonPress}>Send</button>
        </div>
      
      }
    </div>
  );
  
  
}

export default App;
