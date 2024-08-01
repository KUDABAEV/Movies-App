import { Spin } from 'antd';
import React from 'react';

export const Spinner = () => {
  return <Spin tip="loading" fullscreen={true} className="spinner" spinning={true} />;
};
