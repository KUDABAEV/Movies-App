import React from 'react';
import { Tabs } from 'antd';
import { debounce } from 'lodash';

import { SessionService } from '../../api/SessionService.js';
import { MoviesService } from '../../api/MoviesService.js';
import { MoviesSearchService } from '../../api/MoviesSearchService.js';
import { RatedService } from '../../api/RatedService.js';
import SearchMovies from '../searchMovies/SearchMovies.jsx';
import MovieList from '../movie-list/MovieList.jsx';

export default class PageMovies extends React.Component {
  state = {
    token: null,
    loading: false,

    movies: {
      data: [],
      query: '',
      totalPages: 0,
      currentPage: 1,
      totalResult: null,
      error: null,
    },

    rated: {
      data: [],
      totalPages: 0,
      currentPage: 1,
      totalResult: null,
      error: null,
    },
  };

  componentDidMount() {
    this.token = SessionService.getTokenFromSessionStorage().guest_session_id;
    this.debounceUpdateMovies();
    this.updateMovieRated();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.movies.currentPage !== this.state.movies.currentPage ||
      prevState.movies.query !== this.state.movies.query
    ) {
      this.debounceUpdateMovies();
    }

    if (prevState.rated.currentPage !== this.state.rated.currentPage) {
      this.updateMovieRated();
    }
  }

  changeRatedMovie = ({ id, rating }) => {
    const token = SessionService.getTokenFromSessionStorage().guest_session_id;
    const currentMovie = this.state.movies.data.find((movie) => movie.id === id);

    if (currentMovie) {
      currentMovie.rating = rating;
    }

    if (rating > 0) {
      RatedService.addRatedMovie({ id, rating, token });
      this.setState((state) => ({
        ...state,
        rated: {
          ...state.rated,
          data: [...this.state.rated.data, currentMovie && currentMovie],
        },
      }));
    } else {
      RatedService.deleteRatedMovie({ id, token });
      this.setState((state) => ({
        ...state,
        rated: {
          ...state.rated,
          data: state.rated.data.filter((movie) => movie.id !== id),
        },
      }));
    }

    this.setState((state) => ({
      ...state,
      movies: {
        ...state.movies,
        data: state.movies.data.map((movie) => (movie.id === id && currentMovie ? currentMovie : movie)),
      },
    }));
  };

  updateQuery = (query) => {
    this.setState({
      ...this.state,
      movies: {
        ...this.state.movies,
        query,
        currentPage: 1,
      },
    });
  };

  goNextPageMovies = (newPage) => {
    this.setState({
      movies: {
        ...this.state.movies,
        currentPage: newPage,
      },
    });
  };

  goNextPageRated = (newPage) => {
    this.setState({
      rated: {
        ...this.state.rated,
        currentPage: newPage,
      },
    });
  };

  updateMovie() {
    const Api = this.state.movies.query === '' ? MoviesService.getMovies : MoviesSearchService.getMovies;

    this.setState({
      loading: true,
    });

    Api({
      query: this.state.movies.query,
      page: this.state.movies.currentPage,
      token: this.token,
    })
      .then((res) => {
        const data = {
          movies: {
            ...this.state.movies,
            data: res.results,
            totalPages: res.total_pages,
            totalResult: res.total_results,
          },
        };
        this.setState(data);
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

  updateMovieRated() {
    this.setState({
      loading: true,
    });

    RatedService.getRatedMovies({
      query: this.state.movies.query,
      page: this.state.rated.currentPage,
      token: this.token,
    })
      .then((res) => {
        const data = {
          rated: {
            ...this.state.rated,
            data: res.results,
            totalPages: res.total_pages,
            totalResult: res.total_results,
          },
        };
        this.setState(data);
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
    const tabs = [
      {
        key: '1',
        label: 'Search',
        children: (
          <>
            <SearchMovies query={this.state.movies.query} updateQuery={this.updateQuery} />
            <MovieList
              {...this.state.movies}
              loading={this.state.loading}
              goNextPage={this.goNextPageMovies}
              changeRatedMovie={this.changeRatedMovie}
            />
          </>
        ),
      },
      {
        key: '2',
        label: 'Rated',
        children: (
          <>
            <MovieList
              {...this.state.rated}
              loading={this.state.loading}
              goNextPage={this.goNextPageRated}
              changeRatedMovie={this.changeRatedMovie}
            />
          </>
        ),
      },
    ];

    return (
      <div className="container">
        <Tabs centered={true} items={tabs} defaultActiveKey="1" destroyInactiveTabPane />
      </div>
    );
  }
}
