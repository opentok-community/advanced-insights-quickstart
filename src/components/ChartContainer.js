import React from 'react';

const ChartContainer = (props) =>
  <div className="card">
    <div className="card-header">
      <i className={`fas fa-chart-${props.titleIcon}`}></i> {
        props.title
      }
    </div>
    <div className="card-body">
      {props.children}
    </div>
  </div>;

export default ChartContainer;
