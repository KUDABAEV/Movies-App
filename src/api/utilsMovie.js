import { GenresService } from './GenresService.js';
import { RatedService } from './RatedService.js';
import { SessionService } from './SessionService.js';

let cachePromiseRatedMovie = null;

export const transformResultsMovies = async (data) => {
	return Promise.all(data.map(transformMovie));
};

export const transformMovie = async (movie) => {
	const allGenres = await GenresService.getGenres();

	const genres = movie.genre_ids.map((genreId) => {
		return allGenres.find((genre) => genre.id === genreId);
	});

	let rating = movie.rating;

	if (!rating) {
		const token = SessionService.getTokenFromSessionStorage().guest_session_id;
		if (!cachePromiseRatedMovie) {
			cachePromiseRatedMovie = RatedService.getRatedMoviesAll({ token });
		}

		const cacheRatedMovie = await cachePromiseRatedMovie;

		const movieRated = cacheRatedMovie.find(
			(ratedMovie) => ratedMovie.id === movie.id
		);

		if (movieRated) {
			rating = movieRated.rating;
		}
	}

	let posterPath;

	if (movie.poster_path) {
		posterPath = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
	} else {
		posterPath =
			'https://image.tmdb.org/t/p/w500/lKoeJ4VZIsv169jO50TOKHds7ip.jpg';
	}

	return {
		id: movie.id,
		title: movie.title,
		releaseDate: movie.release_date,
		genres,
		posterPath,
		vote: movie.vote_average,
		rating,
		movieOverview: movie.overview,
	};
};
