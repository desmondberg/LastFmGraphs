import { Line, Bar, Doughnut} from 'react-chartjs-2';
import {useState} from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import testdata from './assets/testdata.json'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

//initialise labels for X-axis
let weekLabels = [];
let weeks = testdata.artists[0].scrobbles.weeks.length;
for (let i = 0; i < weeks; i++) {
    weekLabels.push(`Week ${i + 1}`);
}

const getScrobblesByWeek = (weekNumber, artist = null)=>{
    let artistWeeklyScrobbles;
    if(artist!=null){
        //find scrobbles for this artist on the given week and sum them up
        artistWeeklyScrobbles = artist.scrobbles.weeks.find(week=>week.week===weekNumber).daily_scrobbles.reduce((a,b)=>a+b);
    }else{
        //get array of all artists' scrobbles on the given week
        const artistWeeks = testdata.artists.map(artist=>artist.scrobbles.weeks.find(week=>week.week===weekNumber));
        artistWeeklyScrobbles = artistWeeks.map(artist=>artist.daily_scrobbles.reduce((a,b)=>a+b));
    }

    if(artistWeeklyScrobbles) return artistWeeklyScrobbles;
    else return null;
    
}

const sortArtists = (weekNumber, artists)=>{
    console.log(artists);
    
    artists.sort((a,b)=>{
        // console.log(`Week ${weekNumber}: `);
        // console.log(a.name + ": " + getScrobblesByWeek(weekNumber,a));
        // console.log(b.name + ": " + getScrobblesByWeek(weekNumber,b));
        return getScrobblesByWeek(weekNumber,a) - getScrobblesByWeek(weekNumber,b);
    })

    console.log(artists);
}



export default function Graph(props) {
    const [viewerWeek, setViewerWeek] = useState(1);

    if (props.chartType === "line") {
        const datasets = testdata.artists.map(artist => ({
            label: artist.name,
            //for each week, get the sum of its daily scrobbles
            data: artist.scrobbles.weeks.map((week) => week.daily_scrobbles.reduce((a, b) => a + b)),
            borderColor: artist.name === "Pharoah Sanders" ? 'rgba(75, 192, 192, 1)' : 'rgba(153, 102, 255, 1)', //placeholder different colours
            backgroundColor: artist.name === "Pharoah Sanders" ? 'rgba(75, 192, 192, 0.2)' : 'rgba(153, 102, 255, 0.2)',
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
            <div class="graph">
                <Line data={data} options={options} />
            </div>
        )
    } else if (props.chartType === "bar") {
        const artists = testdata.artists;
        
        const datasets = testdata.artists.map(artist => ({
            label: artist.name,
            barPercentage: 0.5,
            barThickness: 24,
            maxBarThickness: 24,
            minBarLength: 2,
            data: [20,32,43],
        }));
        const data={
            labels: testdata.artists.map(artist=>artist.name),
            datasets:datasets
        }
        const options={
            scales: {
                y: {
                  min: 0,    // Set minimum y-axis value
                  max: 100,  // Set maximum y-axis value
                  ticks: {
                    stepSize: 10  // Optional: set step size
                  }
                }
              }
        }

        const handleViewerButtons = (event)=>{
            console.log(event.target.id);
            switch(event.target.id){
                case "right":
                    if(viewerWeek<weeks) setViewerWeek(viewerWeek+1);
                    break;
                case "left":
                    if(viewerWeek>1) setViewerWeek(viewerWeek-1);
                    break;
                default:
                    break;
            }
        }

        return (
            <div class="graph">
                <Bar data={data} options={options}/>
                <span class="viewBtns">
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
            <div class="graph">

            </div>
        )
    } else {
        //idk
    }

}