import { BASE_API_URL, API_KEY } from './api.js';

class Genres {
  _allGenresDetailsPromiseCache = null;

  getGenres() {
    if (this._allGenresDetailsPromiseCache) {
      return this._allGenresDetailsPromiseCache;
    }

    this._allGenresDetailsPromiseCache = fetch(`${BASE_API_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`)
      .then((res) => res.json())
      .then((data) => data.genres);

    return this._allGenresDetailsPromiseCache;
  }
}

const GenresService = new Genres();

export { GenresService };
