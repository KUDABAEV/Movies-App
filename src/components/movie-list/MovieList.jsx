import React from "react";
import { Alert, List, Pagination, Spin } from "antd";
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
  return (
    <List
      grid={{ column: 2 }}
      renderItem={(movie) => <CardItem {...movie} />}
      dataSource={data}
    />
  );
};

export default class MovieList extends React.Component {
  render() {
    console.log(this.props.loading);
    return (
      <div className="moviesList">
        {this.props.error && <ErrorAlert />}
        {this.props.loading && <Spinner />}
        {this.props.totalResult === 0 && <NoResultsAlert />}
        {this.props.data && <MovieListContent data={this.props.data} />}

        <Pagination
          className="custom-pagination"
          defaultCurrent={1}
          current={this.props.currentPage}
          total={this.props.totalPages * 20}
          onChange={this.props.goNextPage}
          showSizeChanger={false}
          pageSize={20}
        />
      </div>
    );
  }
}
