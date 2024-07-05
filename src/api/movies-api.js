export default class MoviesApi {
    _apiBase = 'https://api.themoviedb.org/3/search'
    async getResource() {
        const res = await fetch(`${this._apiBase}/movie?query=return&api_key=1ce8507fa682816e1fab555326740ca7`);

        if (!res.ok) {
            throw new Error(`Could not fetch received ${res.status}`)
        }
        return res.json();
    }
}