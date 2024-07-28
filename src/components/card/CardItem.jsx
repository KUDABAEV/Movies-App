import React from "react";
import { Card, Progress, Rate, Typography } from "antd";
import "./card-item.css";

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
    ? "#E90000"
    : average > 3 && average <= 5
    ? "#E97E00"
    : average > 5 && average <= 7
    ? "#E9D100"
    : "#66E900";

const customFormat = (percent) => {
  if (!percent) {
    return "";
  }
  return (percent / 10).toFixed(1);
};

export default class CardItem extends React.Component {
  render() {
    const {
      id,
      releaseDate,
      moviePosterPath,
      rating,
      title,
      movieOverview,
      genres,
    } = this.props;

    return (
      <Card
        key={id}
        styles={{ body: { padding: 0 } }}
        className="movieItem"
        type="inner"
        style={{ borderRadius: 0, height: 279 }}
      >
        <div className="movieItemInner">
          <div style={{ flex: 1 }}>
            <img
              className="movieImg"
              src={
                moviePosterPath
                  ? `https://image.tmdb.org/t/p/w500${moviePosterPath}`
                  : `https://upload.wikimedia.org/wikipedia/ru/c/ca/Terminator_poster.jpg`
              }
              alt="movie"
            />
          </div>
          <div className="movieContent" style={{ flex: 2, padding: "16px" }}>
            <Progress
              className="movieProgress"
              type="circle"
              percent={rating * 10}
              format={customFormat}
              size={50}
              strokeColor={progressColor(rating)}
            />
            <div className="movieTitle">{title}</div>
            <p className="movieDate">{releaseDate}</p>
            <BadgesList list={genres} />
            <Typography.Paragraph
              ellipsis={{ rows: 4 }}
              style={{ marginBottom: 0 }}
            >
              {movieOverview}
            </Typography.Paragraph>
            <Rate className="rate" count={10} />
          </div>
        </div>
      </Card>
    );
  }
}
