import { BASE_API_URL, API_KEY } from './api.js';
import { transformResultsMovies } from './utilsMovie.js';

class MoviesSearch {
  async getMovies({ query, page }) {
    const urlParams = `${BASE_API_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=${page}`;

    const res = await fetch(urlParams);

    if (!res.ok) {
      throw new Error(`Could not fetch received ${res.status}`);
    }

    const data = await res.json();

    data.results = await transformResultsMovies(data.results);

    return data;
  }
}

const MoviesSearchService = new MoviesSearch();
export { MoviesSearchService };
