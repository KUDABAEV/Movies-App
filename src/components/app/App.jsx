import { ConfigProvider } from 'antd';
import React from 'react';
import PageMovies from '../pageMovies';
import { SessionService } from '../../api/SessionService';
import { Spinner } from '../spinner/Spinner';
import ErrorAlert from '../error/ErrorAlert';

const themeConfig = {
  components: {
    Pagination: {
      itemActiveBg: '#1890FF',
      itemBg: '#f0f0f0',
      itemColor: '#000',
    },
  },
};

export default class App extends React.Component {
  state = {
    loading: true,
    error: null,
  };

  componentDidMount() {
    SessionService.initTokenGuestSession()
      .catch((error) => {
        this.setState({
          error,
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <ConfigProvider theme={themeConfig}>
        {this.state.loading ? <Spinner /> : <PageMovies />}
        {this.state.error && <ErrorAlert text={this.state.error} />}
      </ConfigProvider>
    );
  }
}
