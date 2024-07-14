import React from "react";
import MoviesApi from "../../api/movies-api";
import {Alert, Card, List, Spin, Typography} from "antd";
import './movie-list.css';


export default class MovieList extends React.Component {

    movieApi = new MoviesApi();

    state = {
        data: [],
        loading: true,
        error: false,
    }

    constructor() {
        super();
        this.updateMovie();
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
            error:true,
            loading:false,
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

    render() {

        const {data, loading, error} = this.state;

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

        const content = hasData ? <List
            grid={{column: 2}}
            renderItem={(movie, index) => {
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
                                <div style={{flex: 2, padding: '16px'}}>
                                    <div className='movieTitle'>
                                        {movie.title}
                                    </div>
                                    <p className='movieDate'>{releaseDate ? releaseDate : 'March 5, 2024'}</p>
                                    <div className='badges'>
                                        <div className='badgesItem'>Action</div>
                                        <div className='badgesItem'>Drama</div>
                                    </div>
                                    <Typography.Paragraph
                                        ellipsis={{rows: 4}}

                                        style={{marginBottom: 0}}
                                    >
                                        {movie.overview}
                                    </Typography.Paragraph>
                                </div>
                            </div>
                        </Card>
                    </>
                )
            }
            }
            dataSource={data}
        >
        </List> : null;

        return <div className='moviesList'>
            {errorAlert}
            {spinner}
            {content}
        </div>
    }
}