import React from "react";
import MoviesApi from "../../api/movies-api";
import {Alert, ConfigProvider, List, Spin} from "antd";
import './movie-list.css';
import CardItem from "../card";


const Spinner = () => {
    return (
        <Spin
            tip='loading'
            fullscreen={true}
            className='spinner'
            spinning={true}
        />

    )
}


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


        const content = hasData ?
            <ConfigProvider
                theme={{
                    components: {
                        Pagination: {
                            itemActiveBg: '#1890FF',
                            itemBg: '#f0f0f0',
                            itemColor: '#000',
                        },
                    },
                }}
            >
                <List
                    pagination={{
                        pageSize: 6,
                        align: 'center',
                        className: 'custom-pagination',
                    }}
                    grid={{column: 2}}
                    renderItem={(movie, index) => {
                        const myDate = new Date(movie.release_date);
                        const monthNames = [
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                        ];

                        let releaseDate;

                        if (myDate instanceof Date && !isNaN(myDate)) {
                            releaseDate = monthNames[myDate.getMonth()] + ' ' + myDate.getDate() + ', ' + myDate.getFullYear();
                        } else {
                            releaseDate = 'March 5, 2020';
                        }
                        return (
                            <CardItem
                                movieTitle={movie.title}
                                index={index}
                                movieId={movie.genre_ids}
                                releaseDate={releaseDate}
                                moviePosterPath={movie.poster_path}
                                average={movie.vote_average}
                                movieOverview={movie.overview}
                                genres={genres}
                            ></CardItem>
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
            {loading && <Spinner/>}
            {content}
        </div>
    }
}