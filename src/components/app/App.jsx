import React from "react";
import { Tabs } from "antd";
import "./app.css";
import TabRating from "../tabRating/TabRating";
import TabSearch from "../tabSearch/TabSearch";

export default class App extends React.Component {
  state = {};

  render() {
    const tabs = [
      {
        key: "1",
        label: "Search",
        children: <TabSearch />,
      },
      {
        key: "2",
        label: "Rated",
        children: <TabRating />,
      },
    ];

    return (
      <div className="container">
        <Tabs centered={true} defaultActiveKey="1" items={tabs} />
      </div>
    );
  }
}
