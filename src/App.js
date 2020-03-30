import React, { Component } from 'react';
import ChartContainer from './components/ChartContainer';
import QualityMetrics from './charts/QualityMetrics';
import SessionSearch from './charts/SessionSearch';
import './css/App.css';
import SearchContainer from './components/SearchContainer';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
    	sessionID : ''
    }
  }

  setSessionID = (sessionID) => {
    this.setState({ sessionID });
  }
  
  render() {
    return (
      <div className="App">
        <SearchContainer>
          <SessionSearch sessionSearched={this.setSessionID}/>
        </SearchContainer>
        <ChartContainer titleIcon="area" title="Quality Metrics">
          <QualityMetrics sessionID={this.state.sessionID}/>
        </ChartContainer>
      </div>
    );

  }
}

export default App;
