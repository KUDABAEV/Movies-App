import React from 'react';
import './tab-rating.css';
import MovieList from '../movie-list';
import { debounce } from 'lodash';
import { MoviesService } from '../../api/MoviesService';
import { SessionService } from '../../api/SessionService';
import { RatedService } from '../../api/RatedService';

export default class TabRating extends React.Component {
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
		const token = SessionService.getTokenFromSessionStorage().guest_session_id;
		RatedService.deleteRatedMovie({ id, token });
	};

	goNextPage = (newPage) => {
		this.setState({
			currentPage: newPage,
		});
	};

	updateMoviesRated() {
		const token = SessionService.getTokenFromSessionStorage().guest_session_id;

		this.setState({
			loading: true,
		});

		RatedService.getRatedMovies({ page: this.state.currentPage, token })
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
