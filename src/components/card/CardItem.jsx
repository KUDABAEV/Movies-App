import React from 'react';
import { Card, Progress, Rate, Typography } from 'antd';
import './card-item.css';

const BadgesList = ({ list }) => {
  return (
    <div className="badges">
      {list.map((genre) => (
        <div key={genre.id} className="badgesItem">
          {genre.name}
        </div>
      ))}
    </div>
  );
};

const progressColor = (average) =>
  average >= 0 && average <= 3
    ? '#E90000'
    : average > 3 && average <= 5
      ? '#E97E00'
      : average > 5 && average <= 7
        ? '#E9D100'
        : '#66E900';

const customFormat = (percent) => {
  if (!percent) {
    return '';
  }
  return (percent / 10).toFixed(1);
};

export default class CardItem extends React.Component {
  render() {
    const { id, releaseDate, posterPath, vote, title, movieOverview, genres } = this.props;

    const myDate = new Date(releaseDate);

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    let transformDate;

    if (myDate instanceof Date && !isNaN(myDate)) {
      transformDate = monthNames[myDate.getMonth()] + ' ' + myDate.getDate() + ', ' + myDate.getFullYear();
    } else {
      transformDate = 'March 5, 2020';
    }

    return (
      <Card
        key={id}
        styles={{ body: { padding: 0 } }}
        className="movieItem"
        type="inner"
        style={{ borderRadius: 0, height: 279 }}
      >
        <div className="movieItemInner">
          <div className="movieImgBlock" style={{ flex: 1 }}>
            <img className="movieImg" src={posterPath} alt="movie" />
          </div>
          <div className="movieContent" style={{ flex: 2 }}>
            <Progress
              className="movieProgress"
              type="circle"
              percent={vote * 10}
              format={customFormat}
              size={50}
              strokeColor={progressColor(vote)}
            />
            <div className="movieContentInnerMobile">
              <img className="movieImgMobile" src={posterPath} alt="mobileImg" />
              <div>
                <div className="movieTitle">{title}</div>
                <p className="movieDate">{transformDate}</p>
                <BadgesList list={genres} />
              </div>
            </div>
            <Typography.Paragraph ellipsis={{ rows: 4 }} style={{ marginBottom: 0 }}>
              {movieOverview}
            </Typography.Paragraph>
            <Rate
              className="rate"
              value={this.props.rating}
              count={10}
              onChange={(rating) =>
                this.props.changeRatedMovie({
                  id: this.props.id,
                  rating,
                })
              }
            />
          </div>
        </div>
      </Card>
    );
  }
}
