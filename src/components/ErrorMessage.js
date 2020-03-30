import React from 'react';

const ErrorMessage = (props) =>
  <div className="errorMessage">
    Error! {props.error}
  </div>;

export default ErrorMessage;
