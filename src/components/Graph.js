import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import placeholders from '../utils/defaults/placeholders';
const timestamp = require('unix-timestamp');

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const LAST_FM_API_KEY = "691374224c7f65b3dcac363e42b27e04";



export default function Graph(props) {

    //states
    const [testString, setTestString] = useState("test");
    const [isLoading, setIsLoading] = useState(false);

    //if asArray parameter of fetchDateRange is false, the weeks array will only have one element representing the entire date range
    const [scrobbleQuery, setScrobbleQuery] = useState(
        {
            user: props.username,
            dates: [
                {
                    week: "",
                    from: "",
                    to: ""
                }
            ]
        }
    );
    const [scrobbleData, setScrobbleData] = useState({
        dates: [
            {
                dateRange: "",
                startingWeek: "",
                artists: [
                    {
                        rank: "",
                        artist: "",
                        scrobbles: "",
                        url: ""
                    }
                ]
            }
        ]
    });

    const [graphData, setGraphData] = useState(placeholders.placeholder_line);
    const fetchDateRange = async (weeks, asArray) => {
        //get weekly chart list - an object containing "chart", an array of all date ranges of user
        await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getweeklychartlist&user=${props.username}&api_key=${LAST_FM_API_KEY}&format=json`)
            .then((response) => response.json())
            .then((json) => {
                //reverse for easier indexing
                let chartList = json.weeklychartlist.chart.reverse();
                //if asArray is true, insert each date range as an element of the "weeks" array
                if (asArray) {
                    chartList = chartList.slice(0, weeks).reverse();
                    const formattedWeeks = chartList.map((chart, index) => ({
                        week: index,
                        from: chart.from,
                        to: chart.to,
                    }));
                    console.log(formattedWeeks)
                    setScrobbleQuery({
                        //username stays the same
                        ...scrobbleQuery,
                        dates: formattedWeeks
                    })
                    console.log(scrobbleQuery);

                }
                //if asArray is false, only take the "from" of the earliest date range and the "to" of the latest date range
                else {
                    setScrobbleQuery({
                        //username stays the same
                        ...scrobbleQuery,
                        dates: [
                            {
                                week: 0,
                                from: chartList[weeks - 1].from,
                                to: chartList[0].to
                            }
                        ]
                    });
                }
            })
            .catch((e) => { setTestString(e.toString()) })

    }
    const fetchScrobbles = async (query) => {

        for (let dateRange in query.dates) {
            await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=${query.user}&from=${query.dates[dateRange].from}&to=${query.dates[dateRange].to}&api_key=${LAST_FM_API_KEY}&format=json`)
                .then((response) => response.json())
                .then((json) => {
                    let topArtists = json.weeklyartistchart.artist.slice(0, 3);
                    //setTestString(JSON.stringify(topArtists));
                    //convert unix timestamps into readable date
                    let startingWeek = [
                        timestamp.toDate(parseInt((query.dates[dateRange].from))).toString().split(" ")[1],
                        timestamp.toDate(parseInt((query.dates[dateRange].from))).toString().split(" ")[2],
                        timestamp.toDate(parseInt((query.dates[dateRange].from))).toString().split(" ")[3],
                    ].join(" ");
                    console.log(startingWeek);

                    //format query result into custom object
                    const formattedArtistChart = {
                        dateRange: dateRange,
                        startingWeek: startingWeek,
                        artists: topArtists.map((artist) => ({
                            rank: artist["@attr"].rank,
                            artist: artist.name,
                            scrobbles: artist.playcount,
                            url: artist.url
                        }))
                    };
                    //keep previous results and append the current result
                    setScrobbleData((previous) => ({
                        ...previous,
                        dates: [...previous.dates, formattedArtistChart]
                    }));
                    console.log("scrobble data fetch successful");
                })
                .catch((e) => {
                    console.error(e);  // Handle any fetch errors
                });

        }
    }

    //fetching last.fm API

    useEffect(() => {
        //if statement to prevent this hook from executing twice
        if (props.buttonPressed) {
            console.log("test");
            setScrobbleData({
                dates: []  // Reset to an empty array before fetching
            });

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

            fetchDateRange(getTimeframe(), true);
        }
    }, [props.buttonPressed])

    useEffect(() => {
        fetchScrobbles(scrobbleQuery);
    }, [scrobbleQuery])

    useEffect(() => {
        setTestString(JSON.stringify(scrobbleData));
    }, [scrobbleData])
    


    return (
        <>
            {
                !isLoading ?
                    <>
                        {/*if test string isn't empty, it will appear here*/}
                        {testString ? <p className="tiny">{testString}</p> : <></>}

                        <div className="graph">
                            {/* conditional rendering based on selected chart type */}
                            {props.chartType === "line" && <Line data={graphData.data} />}
                            {props.chartType === "bar" && <Bar data={placeholders.placeholder_bar.data} />}
                            {props.chartType === "donut" && <Doughnut data={placeholders.placeholder_doughnut.data} />}
                        </div>
                    </>
                    :
                    <div>
                        <p>Loading...</p>
                    </div>
            }

        </>
    )




}