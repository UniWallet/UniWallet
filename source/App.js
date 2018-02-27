import React from "react";
import App from "./src/components/App";

//Can implement App here
export default class App1 extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  render() {
    return <App />;
  }
}
