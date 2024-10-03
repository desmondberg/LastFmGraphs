import './App.css';
import Graph from './Graph';
import { useState } from 'react';

function App() {
  const [timeframe,setTimeframe] = useState('time_7');
  const [chartType,setChartType] = useState('line');
  const timeframeHandler = (event)=>{
    setTimeframe(event.target.value);
  };
  const chartTypeHandler = (event)=>{
    setChartType(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Last.fm Graph Tools</h1>
        <div class="user-form">
          <label for="username">Last.fm username:</label>
          <input type="text" class="form-control" name="username" id="" aria-describedby="helpId" placeholder=""/>
          <br/>
          <label for="timeframe">select timeframe</label>
          <select class="form-control" name="timeframe" value={timeframe} onChange={timeframeHandler}>
            <option value="time_7">last 7 days</option>
            <option value="time_30">last 30 days</option>
            <option value="time_90">last 90 days</option>
            <option value="time_180">last 180 days</option>
            <option value="time_365">last 365 days</option>
          </select>
          <label for="chart-type">select chart type</label>
            <select class="form-control" name="chart-type" id="" value={chartType} onChange={chartTypeHandler}>
              <option value="line">Line Graph</option>
              <option value="donut">Doughnut Graph</option>
              <option value="bar">Bar Graph</option>
            </select>
          <button type="submit">confirm</button>
        </div>
      </header>
      <Graph chartType={chartType}/>
    </div>
  );
}

export default App;
