import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import testdata from './assets/testdata.json'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const LAST_FM_API_KEY = "691374224c7f65b3dcac363e42b27e04";

// const getScrobblesByWeek = (weekNumber, artist = null) => {
//     let artistWeeklyScrobbles;
//     if (artist != null) {
//         //find scrobbles for this artist on the given week and sum them up
//         artistWeeklyScrobbles = artist.scrobbles.weeks.find(week => week.week === weekNumber).daily_scrobbles.reduce((a, b) => a + b);
//     } else {
//         //get array of all artists' scrobbles on the given week
//         const artistWeeks = testdata.artists.map(artist => artist.scrobbles.weeks.find(week => week.week === weekNumber));
//         artistWeeklyScrobbles = artistWeeks.map(artist => artist.daily_scrobbles.reduce((a, b) => a + b));
//     }

//     if (artistWeeklyScrobbles) return artistWeeklyScrobbles;
//     else return null;

// }

// const sortArtists = (weekNumber, artists) => {
//     console.log(artists);

//     artists.sort((a, b) => {
//         // console.log(`Week ${weekNumber}: `);
//         // console.log(a.name + ": " + getScrobblesByWeek(weekNumber,a));
//         // console.log(b.name + ": " + getScrobblesByWeek(weekNumber,b));
//         return getScrobblesByWeek(weekNumber, a) - getScrobblesByWeek(weekNumber, b);
//     })

//     console.log(artists);
// }

const stringtoRGB = (str) =>{
    // Hash the string to a single number
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Extract RGB values from the hash
    const r = (hash >> 16) & 0xFF;
    const g = (hash >> 8) & 0xFF;
    const b = hash & 0xFF;

    return `rgb(${r}, ${g}, ${b})`;
}

export default function Graph(props) {
    const [scrobbleWeeks, setScrobbleWeeks] = useState([{from:0,to:0}]);
    const [scrobbleData, setScrobbleData] = useState(null);
    const [entryCount, setEntryCount] = useState(10);
    const [viewerWeek, setViewerWeek] = useState(1);

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
                .then(async response => await response.json())
                .then(data => {
                    let chart = data.weeklychartlist.chart;
                    setScrobbleWeeks(chart.slice(chart.length-1-getTimeframe(),chart.length-1));
                })
                .then(console.log(scrobbleWeeks))
                .catch(err => console.log(err));
            console.log(scrobbleWeeks[0].from);
            console.log(scrobbleWeeks[scrobbleWeeks.length-1].to);
            
            await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=plazzmic&from=${scrobbleWeeks[0].from}&to=${scrobbleWeeks[scrobbleWeeks.length-1].to}&api_key=${LAST_FM_API_KEY}&format=json`)
                .then(async response => await response.json())
                .then(data => {console.log(data); setScrobbleData(data.weeklyartistchart.artist)})
                .then(console.log(scrobbleData))
                .catch(err => console.log(err));
        }
        fetchWeeklyScrobbles();
    }, [props.buttonPressed, props.timeframe])

    //initialise labels for X-axis
    let weekLabels = [];
    for (let i = 0; i < scrobbleWeeks; i++) {
        weekLabels.push(`Week ${i + 1}`);
    }


    if (!scrobbleData) {

    } else {
        if (props.chartType === "line") {
            const datasets = scrobbleData.slice(0, 10).map(artist => ({
                label: artist.name,
                data: artist.playcount,
                borderColor: `rgba(${Math.floor((Math.random() * 255))}, ${Math.floor((Math.random() * 255))}, ${Math.floor((Math.random() * 255))}, 1)`,
                backgroundColor: `rgba(${Math.floor((Math.random() * 255))}, ${Math.floor((Math.random() * 255))}, ${Math.floor((Math.random() * 255))}, 1)`,
                tension: 0.4 //smooth line
            }));


            const data = {
                labels: weekLabels,
                datasets: datasets
            };

            const options = {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
            };
            return (
                <div className="graph">
                    <Line data={data} options={options} />
                </div>
            )
        } else if (props.chartType === "bar") {

            const datasets = [{
                label: "scrobbles",
                barPercentage: 0.5,
                barThickness: 50,
                maxBarThickness: 50,
                minBarLength: 2,
                data: scrobbleData.slice(0, entryCount).map(artist => artist.playcount),
                backgroundColor: scrobbleData.slice(0, entryCount).map(artist => stringtoRGB(artist.name))
            }];
            const data = {
                labels: scrobbleData.slice(0, 10).map(artist => artist.name),
                datasets: datasets
            }
            const options = {

            }

            const handleViewerButtons = (event) => {
                console.log(event.target.id);
                switch (event.target.id) {
                    case "right":
                        if (viewerWeek < scrobbleWeeks.length) setViewerWeek(viewerWeek + 1);
                        break;
                    case "left":
                        if (viewerWeek > 1) setViewerWeek(viewerWeek - 1);
                        break;
                    default:
                        break;
                }
            }

            return (
                <div className="graph">
                    <Bar data={data} options={options} />
                    <span className="viewBtns">
                        <button id="left" onClick={handleViewerButtons}>
                            previous
                        </button>
                        <p>Week {viewerWeek}</p>
                        <button id="right" onClick={handleViewerButtons}>
                            next
                        </button>
                    </span>

                </div>
            )

        } else if (props.chartType === "donut") {
            return (
                <div className="graph">

                </div>
            )
        } else {
            //idk
        }

    }


}