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
    loading: true,
    error: false,
  };

  componentDidMount() {
    this.debounceUpdateMovies();
  }

  onMoviesLoaded = (movies) => {
    this.setState({
      data: movies,
      loading: false,
      error: false,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  updateMovie(searchValue) {
    this.movieApi
      .getMovies(searchValue)
      .then((res) => {
        return res.results;
      })
      .then(this.onMoviesLoaded)
      .catch(this.onError);
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
