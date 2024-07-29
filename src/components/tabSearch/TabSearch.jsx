import React from "react";
import "./tab-search.css";
import { debounce } from "lodash";
import SearchMovies from "../searchMovies";
import MovieList from "../movie-list";
import MoviesApi from "../../api/Movies-api";

export default class TabSearch extends React.Component {
  movieApi = MoviesApi;

  state = {
    data: [],
    query: "",
    totalPages: 0,
    currentPage: 1,
    totalResult: null,
    loading: false,
    error: null,
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

  changeRatedMovie = ({ id, rating }) => {
    this.movieApi.addRatedMovie({ id, rating });
  };

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

      .catch((error) => {
        this.setState({
          error: error.message,
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
        <SearchMovies query={this.state.query} updateQuery={this.updateQuery} />
        <MovieList
          {...this.state}
          goNextPage={this.goNextPage}
          changeRatedMovie={this.changeRatedMovie}
        />
      </>
    );
  }
}