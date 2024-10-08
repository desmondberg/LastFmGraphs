import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import testdata from './utils/testdata.json'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const LAST_FM_API_KEY = "691374224c7f65b3dcac363e42b27e04";



export default function Graph(props) {
    const [testString, setTestString] = useState("");
    const [scrobbleWeeks, setScrobbleWeeks] = useState([{ from: 0, to: 0 }]);
    const [scrobbleData, setScrobbleData] = useState(null);

    const getTimeframe = () => {
        switch (props.timeframe) {
            case "time_7":
                return 1;
            case "time_30":
                return 5;
            case "time_90":
                return 13;
            case "time_180":
                return 26;
            case "time_365":
                return 52;
            default:
                return 1;
        }
    }


    useEffect(() => {
        const fetchWeeklyScrobbles = async () => {
            await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getweeklychartlist&user=plazzmic&api_key=${LAST_FM_API_KEY}&format=json`)
            .then((response)=>response.json)
            .then((data)=>setTestString(data))


            await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=plazzmic&from=$&api_key=${LAST_FM_API_KEY}&format=json`)

        }
        fetchWeeklyScrobbles();
    }, [props.buttonPressed])

    return(
        <div className="graph">
            {/*if test string isn't empty, it will appear here*/}
            {testString.length>0 ? <p>{testString}</p> : <></>}
            {/* conditional rendering based on selected chart type */}
            {props.chartType==="line" && <Line/>}
            {props.chartType==="bar" && <Bar/>}
            {props.chartType==="donut" && <Doughnut/>}
        </div>
    )




}