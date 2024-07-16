export default class MoviesApi {
    _apiBase = 'https://api.themoviedb.org/3';
    _apiKey = '1ce8507fa682816e1fab555326740ca7';
    async getResource() {
        const res = await fetch(`${this._apiBase}/search/movie?api_key=${this._apiKey}&language=en-US&query=Terminator&page=1`);

        if (!res.ok) {
            throw new Error(`Could not fetch received ${res.status}`)
        }
        return res.json();
    }
    async getGenres () {
        const res =  await fetch(`${this._apiBase}/genre/movie/list?api_key=${this._apiKey}&language=en-US`)
        return res.json();
    }
}