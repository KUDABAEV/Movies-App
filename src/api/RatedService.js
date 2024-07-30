import { BASE_API_URL, API_KEY } from './api.js';
import { transformResultsMovies } from './utilsMovie.js';
class Rated {
	transformMovie = async (movie) => {
		const allGenres = await this.getGenres();

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

	getRatedMovies = async ({ page, token }) => {
		const url = `${BASE_API_URL}/guest_session/${token}/rated/movies?api_key=${API_KEY}&page=${page}`;
		const res = await fetch(url);
		const data = await res.json();

		if (res.status === 404) {
			return {
				results: [],
				page: 0,
				total_pages: 0,
				total_results: 0,
			};
		}

		if (!res.ok) {
			throw new Error(`Could not fetch received ${res.status}`);
		}

		data.results = await transformResultsMovies(data.results);

		return data;
	};

	deleteRatedMovie = async ({ id, token }) => {
		const url = `${BASE_API_URL}/movie/${id}/rating?api_key=${API_KEY}&guest_session_id=${token}`;
		const res = await fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
		});

		if (!res.ok) {
			throw new Error(`Could not fetch received ${res.status}`);
		}

		const data = await res.json();

		return data;
	};

	addRatedMovie = async ({ id, rating, token }) => {
		const url = `${BASE_API_URL}/movie/${id}/rating?guest_session_id=${token}&api_key=${API_KEY}`;
		const res = await fetch(url, {
			method: 'POST',

			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({
				value: rating,
			}),
		});

		if (!res.ok) {
			throw new Error(`Could not fetch received ${res.status}`);
		}

		const data = await res.json();

		return data;
	};
}

const RatedService = new Rated();

export { RatedService };
