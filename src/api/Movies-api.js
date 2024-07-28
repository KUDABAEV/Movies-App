export default class MoviesApi {
  _apiBase = "https://api.themoviedb.org/3";
  _apiKey = "1ce8507fa682816e1fab555326740ca7";

  _allGenresDetailsPromiseCache = null;

  async getMovies({ query, page }) {
    if (query === '') {
      query = "Terminator";
    }
    const urlParams = `${this._apiBase}/search/movie?api_key=${this._apiKey}&language=en-US&query=${query}&page=${page}`;

    const res = await fetch(urlParams);

    if (!res.ok) {
      throw new Error(`Could not fetch received ${res.status}`);
    }

    const data = await res.json();

    const transformResultsMovies = await Promise.all(
      data.results.map(this.transformMovie)
    );

    data.results = transformResultsMovies;

    return data;
  }

  getGenres() {
    if (this._allGenresDetailsPromiseCache) {
      return this._allGenresDetailsPromiseCache;
    }

    this._allGenresDetailsPromiseCache = fetch(
      `${this._apiBase}/genre/movie/list?api_key=${this._apiKey}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => data.genres);

    return this._allGenresDetailsPromiseCache;
  }

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
      rating: movie.vote_average,
      movieOverview: movie.overview,
    };
  };
}
