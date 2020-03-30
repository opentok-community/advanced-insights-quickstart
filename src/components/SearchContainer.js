import React from 'react';

const SearchContainer = (props) =>
  <div className="card">
    <div className="card-body">
      {props.children}
    </div>
  </div>;

export default SearchContainer;