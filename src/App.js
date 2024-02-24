import { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [apiKey, setApiKey] = useState('');
  
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
          content: 'Only respond in JSON. The JSON will have attributes of Calories, Carbs, Fats, Protein ONLY. All four of these attributes. NEVER OUTPUT ANYTHING OUTSIDE THE THREE ATTRIBUTES INSIDE THE JSON. **Important**: Once you have finished outputting JSON, end the response immediately, NEVER PUT UNITS!!!!!!!!!!!!!'
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
    fetch('/api/chat/completions', options)
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
      })
      .catch(err => console.error(err));
  }
  

  return(
    <div className='App'>
      <h1>NutriChat</h1>
      <h3>Type in a query, and see some macro nutrients!</h3>
      {response ? <p>{response.choices[0].message.content}</p>: <p></p>}
      <input type="text" value={message} onChange={(handleChange)}/>
      <button onClick={handleButtonPress}>Send</button>
      <input type="text" placeholder="Enter API key" value={apiKey} onChange={handleChangeApiKey}/>
    </div>
  );
  
  
}

export default App;
