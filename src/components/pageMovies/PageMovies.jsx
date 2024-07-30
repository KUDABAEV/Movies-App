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
		activeTab: '1',

		movies: {
			data: [],
			query: '',
			totalPages: 0,
			currentPage: 1,
			totalResult: null,
			loading: false,
			error: null,
		},

		rated: {
			data: [],
			totalPages: 0,
			currentPage: 1,
			totalResult: null,
			loading: false,
			error: null,
		},
	};

	componentDidMount() {
		SessionService.initTokenGuestSession();
		this.token = SessionService.getTokenFromSessionStorage().guest_session_id;
		this.debounceUpdateMovies();
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			prevState.currentPage !== this.state.currentPage ||
			prevState.query !== this.state.query ||
			prevState.activeTab !== this.state.activeTab
		) {
			this.debounceUpdateMovies();
		}
	}

	changeTab = (key) => {
		this.setState({
			activeTab: key,
		});
	};

	changeRatedMovie = ({ id, rating }) => {
		const token = SessionService.getTokenFromSessionStorage().guest_session_id;

		if (rating > 0) {
			RatedService.addRatedMovie({ id, rating, token });
		} else {
			RatedService.deleteRatedMovie({ id, token });
		}

		this.setState((state) => ({
			...state,
			rated: {
				...state.rated,
				data: state.rated.data.filter((movie) => movie.id !== id),
			},
		}));

		this.setState((state) => ({
			...state,
			movies: {
				...state.movies,
				data: state.movies.data.map((movie) => {
					if (movie.id === id) {
						return { ...movie, rating };
					}
					return movie;
				}),
			},
		}));
	};

	updateQuery = (query) => {
		this.setState({
			movies: {
				query,
				currentPage: 1,
			},
		});
	};

	goNextPage = (newPage) => {
		this.setState({
			currentPage: newPage,
		});
	};

	updateMovie() {
		const isRated = this.state.activeTab === '2';
		let Api;

		if (this.state.movies.query === '') {
			Api = MoviesService.getMovies;
		} else {
			Api = MoviesSearchService.getMovies;
		}

		if (isRated) {
			Api = RatedService.getRatedMovies;
		}

		this.setState({
			loading: true,
		});

		Api({
			query: this.state.movies.query,
			page: isRated
				? this.state.rated.currentPage
				: this.state.movies.currentPage,
			token: this.token,
		})
			.then((res) => {
				this.setState({
					[isRated ? 'rated' : 'movies']: {
						data: res.results,
						totalPages: res.total_pages,
						totalResult: res.total_results,
					},
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

		console.log(this.state);
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
						<SearchMovies
							query={this.state.movies.query}
							updateQuery={this.updateQuery}
						/>
						<MovieList
							{...this.state.movies}
							goNextPage={this.goNextPage}
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
							goNextPage={this.goNextPage}
							changeRatedMovie={this.changeRatedMovie}
						/>
					</>
				),
			},
		];

		return (
			<div className="container">
				<Tabs
					centered={true}
					items={tabs}
					ActiveKey={this.state.activeTab}
					onChange={this.changeTab}
					destroyInactiveTabPane
				/>
			</div>
		);
	}
}
