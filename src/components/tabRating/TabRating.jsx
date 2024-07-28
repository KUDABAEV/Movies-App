import React from "react";
import "./tab-rating.css";
import MovieList from "../movie-list";
import { debounce } from "lodash";
import MoviesApi from "../../api/Movies-api";

export default class TabRating extends React.Component {
  movieApi = new MoviesApi();

  state = {
    data: [],
    totalPages: 0,
    currentPage: 1,
    totalResult: null,
    loading: false,
    error: false,
  };

  componentDidMount() {
    this.debounceUpdateMovies();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage !== this.state.currentPage) {
      this.debounceUpdateMovies();
    }
  }

  goNextPage = (newPage) => {
    this.setState({
      currentPage: newPage,
    });
  };

  updateMovie() {
    this.setState({
      loading: true,
    });

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
      <>
        <MovieList {...this.state} goNextPage={this.goNextPage} />
      </>
    );
  }
}
