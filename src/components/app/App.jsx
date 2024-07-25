import React from "react";
import './app.css';
import MovieList from "../movie-list";
import {Input, Tabs} from "antd";

export default class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        this.setState(() => {
            return {
                searchValue: value


            }
        })
    }

    render() {
        const { searchValue } = this.state;
        return (
            <div className='container'>
                <Tabs centered={true} defaultActiveKey="1" items={[
                    {
                        key: '1',
                        label: 'Search',
                        children: (
                            <>
                                <Input
                                    value={searchValue}
                                    placeholder="Type to search..."
                                    onChange={(e) => this.handleChange(e.target.value)}
                                />
                                {
                                    searchValue.length > 0 ? <MovieList searchValue={searchValue} /> : <MovieList />
                                }
                            </>
                        )
                    },
                    {
                        key: '2',
                        label: 'Rated',
                        children: (
                            <>
                                <div>Rated</div>
                            </>
                        )
                    },
                ]} />
            </div>
        )
    }
}
