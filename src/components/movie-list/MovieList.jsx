import React from "react";
import { Alert, ConfigProvider, List, Spin } from "antd";
import "./movie-list.css";
import CardItem from "../card";

const Spinner = () => {
  return (
    <Spin tip="loading" fullscreen={true} className="spinner" spinning={true} />
  );
};

export default class MovieList extends React.Component {


  render() {
    const { data, loading, error } = this.props;
    const hasData = !(loading || error);

    const errorAlert = error ? (
      <Alert showIcon message="Ошибка при получения данных" type="error" />
    ) : null;

    const content = hasData ? (
      <ConfigProvider
        theme={{
          components: {
            Pagination: {
              itemActiveBg: "#1890FF",
              itemBg: "#f0f0f0",
              itemColor: "#000",
            },
          },
        }}
      >
        <List
          pagination={{
            pageSize: 6,
            align: "center",
            className: "custom-pagination",
          }}
          grid={{ column: 2 }}
          renderItem={(movie, index) => {
            const myDate = new Date(movie.releaseDate);
            const monthNames = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];

            let releaseDate;

            if (myDate instanceof Date && !isNaN(myDate)) {
              releaseDate =
                monthNames[myDate.getMonth()] +
                " " +
                myDate.getDate() +
                ", " +
                myDate.getFullYear();
            } else {
              releaseDate = "March 5, 2020";
            }
            return <CardItem {...movie} />;
          }}
          dataSource={data}
        ></List>
      </ConfigProvider>
    ) : null;

    return (
      <div className="moviesList">
        {errorAlert}
        {loading && <Spinner />}
        {content}
      </div>
    );
  }
}
