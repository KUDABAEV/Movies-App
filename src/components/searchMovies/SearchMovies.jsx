import React from "react";
import {Input} from "antd";
import './search-movies.css';

export default class SearchMovies extends React.Component {
    state = {
        searchValue: '',
    };

    changeSearchValue(newValue) {
        this.setState(() => {
            return {
                searchValue: newValue,
            }
        })


    }

    render() {
        const {searchValue} = this.state;

        return (
            <Input
                value={searchValue}
                placeholder="Type to search..."
                onChange={(e) => this.changeSearchValue(e.target.value)}
            />
        )
    }
}