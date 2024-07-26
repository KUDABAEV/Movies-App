export default class MoviesApi {
  _apiBase = "https://api.themoviedb.org/3";
  _apiKey = "1ce8507fa682816e1fab555326740ca7";

  async getMovies(search = "Terminator") {
    const url = `${this._apiBase}/search/movie?api_key=${this._apiKey}&language=en-US&query=${search}&page=1`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch received ${res.status}`);
    }

    const data = await res.json();

    data.results = data.results.map((movie) => {
      return {
        id: movie.id,
        title: movie.title,
        releaseDate: movie.release_date,
        genreIds: movie.genre_ids,
        moviePosterPath: movie.poster_path,
        rating: movie.vote_average,
        movieOverview: movie.overview,
      };
    });

    return data;
  }

  async getGenres() {
    const res = await fetch(
      `${this._apiBase}/genre/movie/list?api_key=${this._apiKey}&language=en-US`
    );
    return res.json();
  }
}
