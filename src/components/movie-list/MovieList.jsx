import React from "react";
import { Alert, ConfigProvider, List, Spin } from "antd";
import "./movie-list.css";
import CardItem from "../card";

const Spinner = () => {
  return (
    <Spin tip="loading" fullscreen={true} className="spinner" spinning={true} />
  );
};

const ErrorAlert = () => {
  return <Alert showIcon message="Ошибка при получения данных" type="error" />;
};

const NoResultsAlert = () => {
  return <Alert showIcon message="Ничего не найдено" type="info" />;
};

const MovieListContent = ({ data }) => {
  const themeConfig = {
    components: {
      Pagination: {
        itemActiveBg: "#1890FF",
        itemBg: "#f0f0f0",
        itemColor: "#000",
      },
    },
  };

  const paginationConfig = {
    align: "center",
    className: "custom-pagination",
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <List
        pagination={paginationConfig}
        grid={{ column: 2 }}
        renderItem={(movie) => <CardItem {...movie} />}
        dataSource={data}
      />
    </ConfigProvider>
  );
};

export default class MovieList extends React.Component {
  render() {
    return (
      <div className="moviesList">
        {this.props.error && <ErrorAlert />}
        {this.props.loading && <Spinner />}
        {this.props.totalResult === 0 && <NoResultsAlert />}
        {this.props.data && <MovieListContent data={this.props.data} />}
      </div>
    );
  }
}
