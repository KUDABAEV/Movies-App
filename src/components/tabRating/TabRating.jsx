import React from "react";
import "./tab-rating.css";
import MovieList from "../movie-list";
import { debounce } from "lodash";
import MoviesApi from "../../api/Movies-api";

export default class TabRating extends React.Component {
  movieApi = MoviesApi;

  state = {
    data: [],
    totalPages: 0,
    currentPage: 1,
    totalResult: null,
    loading: false,
    error: null,
  };

  componentDidMount() {
    this.debounceUpdateMoviesRated();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage !== this.state.currentPage) {
      this.debounceUpdateMoviesRated();
    }
  }

  deleteRatedMovie = ({ id }) => {
    this.movieApi.deleteRatedMovie({ id });
  };

  goNextPage = (newPage) => {
    this.setState({
      currentPage: newPage,
    });
  };

  updateMoviesRated() {
    this.setState({
      loading: true,
    });

    this.movieApi
      .getRatedMovies({ page: this.state.currentPage })
      .then((res) => {

        this.setState({
          data: res.results,
          totalPages: res.total_pages,
          totalResult: res.total_results,
        });
      })

      .catch((err) => {
        this.setState({
          error: err.message,
        });
      })

      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }

  debounceUpdateMoviesRated = debounce(() => {
    this.updateMoviesRated();
  }, 1000);

  render() {
    return (
      <>
        <MovieList
          {...this.state}
          goNextPage={this.goNextPage}
          deleteRatedMovie={this.deleteRatedMovie}
        />
      </>
    );
  }
}
