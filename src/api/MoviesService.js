import { BASE_API_URL, API_KEY } from './api.js';
import { transformResultsMovies } from './utilsMovie.js';

class MoviesApi {
	_allGenresDetailsPromiseCache = null;

	async getMovies({ query, page }) {
		if (query === '') {
			query = 'Terminator';
		}

		const urlParams = `${BASE_API_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=${page}`;

		const res = await fetch(urlParams);

		if (!res.ok) {
			throw new Error(`Could not fetch received ${res.status}`);
		}

		const data = await res.json();

		data.results = await transformResultsMovies(data.results);

		return data;
	}

	getGenres() {
		if (this._allGenresDetailsPromiseCache) {
			return this._allGenresDetailsPromiseCache;
		}

		this._allGenresDetailsPromiseCache = fetch(
			`${BASE_API_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
		)
			.then((res) => res.json())
			.then((data) => data.genres);

		return this._allGenresDetailsPromiseCache;
	}
}

const MoviesService = new MoviesApi();
export { MoviesService };
