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
    	sessionID : ' '
    }
  }


  setSessionID(e){
    // let ele=e.target;
		this.setState({
      sessionID: e
    });
    console.log(this.state.sessionID)
  }
  
  render() {
    return (
      <div className="App">
        <SearchContainer>
          <SessionSearch sessionSearched={this.setSessionID.bind(this)}/>
        </SearchContainer>

        <ChartContainer titleIcon="area" title="Quality Metrics">
          <QualityMetrics key={this.state.sessionID} />
        </ChartContainer>
      </div>
    );

  }
}

export default App;
