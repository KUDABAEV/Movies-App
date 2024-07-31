import { BASE_API_URL, API_KEY } from './api.js';
import { transformResultsMovies } from './utilsMovie.js';

class Movies {
  async getMovies({ page }) {
    const url = `${BASE_API_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&api_key=${API_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch received ${res.status}`);
    }

    const data = await res.json();

    data.results = await transformResultsMovies(data.results);

    return data;
  }
}

const MoviesService = new Movies();
export { MoviesService };
