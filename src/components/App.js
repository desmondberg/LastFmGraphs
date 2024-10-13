import '../styles/App.css';
import Graph from './Graph';
import { useState, useEffect } from 'react';

function App() {
  const [timeframe,setTimeframe] = useState('time_7');
  const [chartType,setChartType] = useState('line');
  const [confirmButtonPressed, setConfirmButtonPressed] = useState(false)
  const timeframeHandler = (event)=>{
    setTimeframe(event.target.value);
  };
  const chartTypeHandler = (event)=>{
    setChartType(event.target.value);
  };

  useEffect(() => {
    if (confirmButtonPressed) {
        console.log('confirm button pressed');
        //wait a bit before resetting the button's status
        setTimeout(() => setConfirmButtonPressed(false), 500);
    }
  }, [confirmButtonPressed]); 

  return (
    <div className="App">
      <header className="App-header">
        <h1>Last.fm Graph Tools</h1>
        <div className="user-form">
          <label for="username">Last.fm username:</label>
          <input type="text" className="form-control" name="username" id="" aria-describedby="helpId" placeholder=""/>
          <br/>
          <label for="timeframe">select timeframe</label>
          <select className="form-control" name="timeframe" value={timeframe} onChange={timeframeHandler}>
            <option value="time_7">last 7 days</option>
            <option value="time_30">last 30 days</option>
            <option value="time_90">last 90 days</option>
            <option value="time_180">last 180 days</option>
            <option value="time_365">last 365 days</option>
          </select>
          <label for="chart-type">select chart type</label>
            <select className="form-control" name="chart-type" id="" value={chartType} onChange={chartTypeHandler}>
              <option value="line">Line Graph</option>
              <option value="donut">Doughnut Graph</option>
              <option value="bar">Bar Graph</option>
            </select>
          <button onClick={() => setConfirmButtonPressed(true)}>confirm</button>
        </div>
      </header>
      <Graph username={"plazzmic"} timeframe={timeframe} chartType={chartType} buttonPressed={confirmButtonPressed}/>
    </div>
  );
}

export default App;
