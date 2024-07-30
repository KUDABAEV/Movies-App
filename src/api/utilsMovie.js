import { GenresService } from './GenresService.js';

export const transformResultsMovies = async (data) => {
	return Promise.all(data.map(transformMovie));
};

export const transformMovie = async (movie) => {
	const allGenres = await GenresService.getGenres();

	const genres = movie.genre_ids.map((genreId) => {
		return allGenres.find((genre) => genre.id === genreId);
	});

	return {
		id: movie.id,
		title: movie.title,
		releaseDate: movie.release_date,
		genres,
		moviePosterPath: movie.poster_path,
		vote: movie.vote_average,
		rating: movie.rating,
		movieOverview: movie.overview,
	};
};
