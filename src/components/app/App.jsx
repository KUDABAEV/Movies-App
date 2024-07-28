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
    totalPages: 0,
    currentPage: 1,
    totalResult: null,
    loading: true,
    error: false,
  };

  componentDidMount() {
    this.debounceUpdateMovies();
  }

  updateMovie(searchValue) {
    this.movieApi
      .getMovies(searchValue)
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

  debounceUpdateMovies = debounce((searchValue) => {
    this.updateMovie(searchValue);
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
                    debounceUpdateMovies={this.debounceUpdateMovies}
                  />
                  <MovieList {...this.state} />
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
