import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-zoom'
import { get } from 'lodash';
import Loading from '../components/Loading';
import NoResultsFound from '../components/NoResultsFound';

const apiKey = process.env.REACT_APP_API_KEY;

/* Get the publisherMinutes for the specified session ID */
const sessionQuery = sessionIds => gql`
{
  project(projectId: ${apiKey}) {
   sessionData {
    sessions(sessionIds: [${sessionIds}]) {
      resources {
        publisherMinutes
        meetings {
          resources {
            publishers {
              resources {
                stream {
                  streamId
                }
                streamStatsCollection {
                  resources {
                    videoBitrateKbps
                    createdAt
                  }
                }
              }
            }
          }
        }
      }  
    }
   }
  }
}
`;

class QualityMetrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      streamChartData: [],
      loading: false,
      noresults: false,
      sessionID: ' '
    }
    this.sessionIDText = "Please enter a Session ID"
  }

  // Get the session data 
  getSessionsInfo = async (sessionIds) => {
    const query = { query: sessionQuery(sessionIds) };
    const results = await this.props.client.query(query);
    return get(results.data, 'project.sessionData.sessions.resources', []);
  }

  async componentDidMount() {
    this.sessionIDText = "Please enter a Session ID"
  }

  convertStreamArrayToChartData = (meetings) => {

    if (meetings === undefined || meetings.length === 0) {
      this.setState({
        noresults: true
      });
    } else{
      this.setState({
        noresults: false
      });
    }

    const colors = ['#66C5CC', '#F6CF71', '#F89C74', '#DCB0F2', '#87C55F',
      '#9EB9F3', '#FE88B1', '#C9DB74', '#8BE0A4', '#B497E7', '#D3B484', '#B3B3B3'];
    let colorIndex = 0;

    const publisherArray = meetings.map(meeting => get(meeting, 'publishers.resources', []))
    const publisherArrayFlat = publisherArray.flat()

    const chartData = publisherArrayFlat.reduce((acc, streamData) => {

      const streamStatsArray = get(streamData, 'streamStatsCollection.resources', []);
      // Discard short publishers
      if (streamStatsArray.length < 3) {
        return acc;
      }
      const color = colors[colorIndex % colors.length];

      colorIndex++;

      const shortStreamId = streamData.stream.streamId.substring(0, 8);

      const chartData = {
        borderColor: color,
        fill: false,
        label: `Stream ${shortStreamId}...`,
        data: streamStatsArray.reduce((acc, streamStats) => {
            // Discard stats anomolously large bitrates
            if (streamStats.videoBitrateKbps > 1000) {
              return acc;
            }
            return acc.concat({
              x: streamStats.createdAt,
              y: streamStats.videoBitrateKbps,
            })
          }, []),
      };
      return acc.concat(chartData)
    }, []);
    return chartData;
  }

  async componentDidUpdate(prevProps) {

    // Check if a new search was made
    if (prevProps.sessionID !== this.props.sessionID){

      // Remove any spaces in SessionID
      var newSessionID = this.props.sessionID.replace(/\s/g, '');
      this.sessionIDText = "Session ID: "+newSessionID

      // Show Loading when searching for session ID
      this.setState({
        loading: true,
      });

      // Get information per session, Note: this returns an array of session data
      const sessionsInfo = await this.getSessionsInfo(`"${newSessionID}"`);
      const meetingArray = get(sessionsInfo[0], 'meetings.resources', []);

      // Create an array of meetings per specified session ID
      let meetings = [];
      meetingArray.forEach(meeting => {
        meetings.push(meeting) 
      });

      const streamChartData = this.convertStreamArrayToChartData(meetings);

      this.setState({
        streamChartData,
        loading: false,
      });
    }
  }
  

  render() {
    if (this.state.loading) return <Loading />;
    if (this.state.noresults) return <NoResultsFound />;

    return (       
        <div>
        <p>{this.sessionIDText}</p>
        <Line
          data={{
            datasets: this.state.streamChartData
          }}
          options={{
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'bitrate (kbps)'
                }
              }],
              xAxes: [{
                type: 'time',
                distribution: 'linear',
                time: {
                  unit: 'minute',
                  stepSize: 15,
                  distribution: 'series',
                  displayFormats: {
                    minute: 'MMM DD, hh:mm'
                  }
                },
              }]
            },
            pan: {
              enabled: true,
              mode: 'x'   
            },
            zoom: {
              enabled: true,         
              mode: 'x'
            },
            responsive: true

          }}
          
        />
        </div>
    );
  }
}

export default withApollo(QualityMetrics);
