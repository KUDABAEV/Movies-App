import React from "react";
import MovieList from "../movie-list";
import { Tabs } from "antd";
import SearchMovies from "../searchMovies";
import Rated from "../rated";
import MoviesApi from "../../api/Movies-api";
import debounce from "lodash/debounce";
import "./app.css";

export default class App extends React.Component {
  movieApi = new MoviesApi();

  state = {
    data: [],
    query: "",
    totalPages: 0,
    currentPage: 1,
    totalResult: null,
    loading: true,
    error: false,
  };

  componentDidMount() {
    this.debounceUpdateMovies();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentPage !== this.state.currentPage ||
      prevState.query !== this.state.query
    ) {
      this.debounceUpdateMovies();
    }
  }

  updateQuery = (query) => {
    this.setState({
      query,
      currentPage: 1,
    });
  };

  goNextPage = (newPage) => {
    this.setState({
      currentPage: newPage,
    });
  };

  updateMovie() {
    this.movieApi
      .getMovies({ query: this.state.query, page: this.state.currentPage })
      .then((res) => {
        this.setState({
          data: res.results,
          totalPages: res.total_pages,
          totalResult: res.total_results,
        });
      })

      .catch(() => {
        this.setState({
          error: true,
        });
      })

      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }

  debounceUpdateMovies = debounce(() => {
    this.updateMovie();
  }, 1000);

  render() {
    return (
      <div className="container">
        <Tabs
          centered={true}
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "Search",
              children: (
                <>
                  <SearchMovies
                    query={this.state.query}
                    updateQuery={this.updateQuery}
                  />
                  <MovieList {...this.state} goNextPage={this.goNextPage} />
                </>
              ),
            },
            {
              key: "2",
              label: "Rated",
              children: <Rated />,
            },
          ]}
        />
      </div>
    );
  }
}
