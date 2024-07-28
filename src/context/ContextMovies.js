import React, { createContext } from "react";

export const ContextMovies = createContext({});

export default class ProviderMovies extends React.Component {
  render() {
    const context = {
      ...this.state,
    };
    
    return (
      <ContextMovies.Provider value={context}>
        {this.props.children}
      </ContextMovies.Provider>
    );
  }
}
