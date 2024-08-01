import React from 'react';
import { Alert } from 'antd';

const ErrorAlert = ({ text = 'Ошибка при получении данных' }) => {
  return <Alert showIcon message={text} type="error" />;
};

export default ErrorAlert;
