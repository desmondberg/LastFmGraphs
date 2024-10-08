import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import placeholders from '../utils/defaults/placeholders';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const LAST_FM_API_KEY = "691374224c7f65b3dcac363e42b27e04";



export default function Graph(props) {
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
    //states
    const [testString, setTestString] = useState("test");

    //fetching last.fm API
    useEffect(() => {
        const fetchWeeklyScrobbles = async () => {
            //get weekly chart list - an object containing "chart", an array of all date ranges of user
            await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getweeklychartlist&user=plazzmic&api_key=${LAST_FM_API_KEY}&format=json`)
                .then((response) => response.json())
                .then((json)=>setTestString(JSON.stringify(json)))
                .catch((e) => { setTestString(e) })


            // await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=plazzmic&from=$&api_key=${LAST_FM_API_KEY}&format=json`)

        }
        fetchWeeklyScrobbles();
    }, [props.buttonPressed])

    return (
        <>
            {/*if test string isn't empty, it will appear here*/}
            {testString ? <p className="tiny">{testString}</p> : <></>}

            <div className="graph">
                {/* conditional rendering based on selected chart type */}
                {props.chartType === "line" && <Line data={placeholders.placeholder_line.data} />}
                {props.chartType === "bar" && <Bar data={placeholders.placeholder_bar.data} />}
                {props.chartType === "donut" && <Doughnut data={placeholders.placeholder_doughnut.data} />}
            </div>
        </>
    )




}