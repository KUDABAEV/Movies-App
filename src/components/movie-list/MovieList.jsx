import React from "react";
import MoviesApi from "../../api/movies-api";
import {Alert, Card, ConfigProvider, List, Progress, Rate, Spin, Typography} from "antd";
import './movie-list.css';


export default class MovieList extends React.Component {

    movieApi = new MoviesApi();

    state = {
        data: [],
        loading: true,
        error: false,
        genres: [],
    }

    componentDidMount() {
        this.updateMovie();
        this.updateGetGenres();
    }

    onMoviesLoaded = (movies) => {
        this.setState({
            data: movies,
            loading: false,
            error: false,
        })
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false,
        })
    }

    updateMovie() {
        this.movieApi
            .getResource()
            .then((res) => {
                return res.results;
            })
            .then(this.onMoviesLoaded)
            .catch(this.onError)
    }

    updateGetGenres() {
        this.movieApi
            .getGenres()
            .then((res) => {
                return res.genres;
            })
            .then((genresRes) => {
                this.setState({
                    genres: genresRes,
                })
            })
    }

    render() {

        const {data, loading, error, genres} = this.state;

        const hasData = !(loading || error);

        const errorAlert = error ? <Alert
            showIcon
            message='Ошибка при получения данных'
            type='error'
        /> : null;

        const spinner = loading ? <Spin
            tip='loading'
            fullscreen={true}
            className='spinner'
            spinning={true}
        >
        </Spin> : null;

        const content = hasData ?
            <ConfigProvider
                theme={{
                    components: {
                        Pagination: {
                            itemActiveBg: '#1890FF', // цвет активного элемента
                            itemBg: '#f0f0f0', // цвет фона элементов
                            itemColor: '#000', // цвет текста элементов
                        },
                    },
                }}
            >
                <List
                    pagination={{
                        pageSize:6,
                        align: 'center',
                        className: 'custom-pagination',
                    }}
                    grid={{column: 2}}
                    renderItem={(movie, index) => {
                        const movieId = movie.genre_ids;
                        const myDate = new Date(movie.release_date);
                        const monthNames = [
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                        ];
                        const releaseDate = monthNames[myDate.getMonth()] + ' ' + myDate.getDate() + ', ' + myDate.getFullYear();

                        return (
                            <>
                                <Card
                                    key={index}
                                    bodyStyle={{padding: 0}}
                                    className='movieItem'
                                    type='inner'
                                    style={{borderRadius: 0, height: 279}}
                                >
                                    <div className='movieItemInner' style={{display: 'flex'}}>
                                        <div style={{flex: 1}}>
                                            <img
                                                className='movieImg'
                                                src={movie.poster_path
                                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                                    : `https://upload.wikimedia.org/wikipedia/ru/c/ca/Terminator_poster.jpg`}
                                                alt="movie"
                                            />
                                        </div>
                                        <div className='movieContent' style={{flex: 2, padding: '16px'}}>
                                            <Progress
                                                className='movieProgress'
                                                type='circle'
                                                percent={movie.vote_average * 10}
                                                format={(percent) => {
                                                    if (!percent) {
                                                        return ''
                                                    }
                                                    return (percent / 10).toFixed(1)
                                                }}
                                                size={50}
                                                strokeColor="#E9D100"
                                            />
                                            <div className='movieTitle'>
                                                {movie.title}
                                            </div>
                                            <p className='movieDate'>{releaseDate ? releaseDate : 'March 5, 2024'}</p>
                                            <div className='badges'>
                                                {genres.map((genre) => {
                                                    if (movieId.includes(genre.id)) {
                                                        return (
                                                            <div key={genre.id} className='badgesItem'>
                                                                {genre.name}
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </div>
                                            <Typography.Paragraph
                                                ellipsis={{rows: 4}}

                                                style={{marginBottom: 0}}
                                            >
                                                {movie.overview}
                                            </Typography.Paragraph>
                                            <Rate className='rate' count={10} />
                                        </div>
                                    </div>
                                </Card>
                            </>
                        )
                    }
                    }
                    dataSource={data}
                >
                </List>
            </ConfigProvider>
             : null;

        return <div className='moviesList'>
            {errorAlert}
            {spinner}
            {content}
        </div>
    }
}