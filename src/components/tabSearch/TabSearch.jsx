import React from 'react';
import { debounce } from 'lodash';

import SearchMovies from '../searchMovies';
import MovieList from '../movie-list';
import { MoviesSearchService } from '../../api/MoviesSearchService.js';
import { SessionService } from '../../api/SessionService.js';
import { RatedService } from '../../api/RatedService.js';
import { MoviesService } from '../../api/MoviesService.js';

import './tab-search.css';

export default class TabSearch extends React.Component {
	state = {
		data: [],
		query: '',
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
		const token = SessionService.getTokenFromSessionStorage().guest_session_id;
		RatedService.addRatedMovie({ id, rating, token });

		this.setState({
			data: this.state.data.map((movie) => {
				if (movie.id === id) {
					return { ...movie, rating };
				}

				return movie;
			}),
		});
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
		const Api = this.state.query === '' ? MoviesService : MoviesSearchService;
		this.setState({
			loading: true,
		});

		Api.getMovies({
			query: this.state.query,
			page: this.state.currentPage,
		})
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
