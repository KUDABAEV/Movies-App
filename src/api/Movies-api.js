class MoviesApi {
  _apiBase = "https://api.themoviedb.org/3";
  _apiKey = "1ce8507fa682816e1fab555326740ca7";

  _allGenresDetailsPromiseCache = null;
  _tokenGuestSessionPromiseCache = null;

  async getMovies({ query, page }) {
    if (query === "") {
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
      vote: movie.vote_average,
      rating: movie.rating,
      movieOverview: movie.overview,
    };
  };

  getTokenSession = async () => {
    if (this._tokenGuestSessionPromiseCache) {
      return this._tokenGuestSessionPromiseCache;
    }

    this._tokenGuestSessionPromiseCache = fetch(
      `${this._apiBase}/authentication/guest_session/new?api_key=${this._apiKey}`
    )
      .then((res) => res.json())
      .then((data) => data.guest_session_id);

    return this._tokenGuestSessionPromiseCache;
  };

  getRatedMovies = async ({ page }) => {
    const tokenSession = await this.getTokenSession();
    console.log(tokenSession);
    const url = `${this._apiBase}/guest_session/${tokenSession}/rated/movies?api_key=${this._apiKey}&page=${page}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch received ${res.status}`);
    }

    const data = await res.json();

    const transformResultsMovies = await Promise.all(
      data.results.map(this.transformMovie)
    );

    data.results = transformResultsMovies;

    return data;
  };

  deleteRatedMovie = async ({ id, token }) => {
    const tokenSession = await this.getTokenSession();
    console.log(tokenSession);
    const url = `${this._apiBase}/movie/${id}/rating?api_key=${this._apiKey}&guest_session_id=${tokenSession}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!res.ok) {
      throw new Error(`Could not fetch received ${res.status}`);
    }

    const data = await res.json();

    return data;
  };

  addRatedMovie = async ({ id, token, rating }) => {
    const tokenSession = await this.getTokenSession();
    console.log(tokenSession);

    const url = `${this._apiBase}/movie/${id}/rating?api_key=${this._apiKey}&guest_session_id=${tokenSession}`;
    const res = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json;charset=utf-8",
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

export default new MoviesApi();
