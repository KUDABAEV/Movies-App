import { ConfigProvider } from 'antd';
import React from 'react';
import PageMovies from '../pageMovies';

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
  render() {
    return (
      <ConfigProvider theme={themeConfig}>
        <PageMovies />
      </ConfigProvider>
    );
  }
}
