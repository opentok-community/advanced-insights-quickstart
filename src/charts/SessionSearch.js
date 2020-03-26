import React, { Component } from 'react';
import { withApollo } from 'react-apollo';

class SessionSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
          sessionID: ' '
        };
        this.handleChange = this.handleChange.bind(this);
      }
    
    // searchSession() {
    //     // console.log( this.state.sessionID);
    //     // this.props.sessionSearched(this.state.sessionID)
    //     // (e)=>{this.props.sessionSearched(this.state.sessionID)}
    //     console.log('searchSession', this.state.sessionID);
    // }
    handleChange({ target }) {
        this.setState({
          [target.name]: target.value
        });
    }

    render() {
      return (
        <form>
            <div className="input-group">
                <input 
                    type="text" 
                    name="sessionID"
                    placeholder="Search Session ID" 
                    value={ this.state.sessionID}
                    onChange={ this.handleChange } 
                    className="form-control" 
                    aria-label="Search" 
                    aria-describedby="basic-addon2"
                    
                />
                <button 
                    className="btn btn-primary" 
                    type="button"
                    onClick={(e)=>{this.props.sessionSearched(this.state.sessionID)}}
                >
                    <i className="fas fa-search"></i>
                </button>
            </div>
        </form>
      );  
    }
  }

export default withApollo(SessionSearch);