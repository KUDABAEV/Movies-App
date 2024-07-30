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
	onClisckRated = (rating) => {
		console.log(rating, this.props.rating);
		if (rating === 0) {
			if (this.props.deleteRatedMovie) {
				this.props.deleteRatedMovie({ id: this.props.id });
			} else {
				alert('deleteRatedMovie is not defined');
			}
		} else {
			if (this.props.changeRatedMovie) {
				this.props.changeRatedMovie({ id: this.props.id, rating });
			} else {
				alert('changeRatedMovie is not defined');
			}
		}
	};

	render() {
		const { id, releaseDate, posterPath, vote, title, movieOverview, genres } =
			this.props;

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
			transformDate =
				monthNames[myDate.getMonth()] +
				' ' +
				myDate.getDate() +
				', ' +
				myDate.getFullYear();
		} else {
			transformDate = 'March 5, 2020';
		}

		return (
			<Card
				key={id}
				styles={{ body: { padding: 0 } }}
				className="movieItem"
				type="inner"
				style={{ borderRadius: 0, height: 279 }}>
				<div className="movieItemInner">
					<div style={{ flex: 1 }}>
						<img className="movieImg" src={posterPath} alt="movie" />
					</div>
					<div className="movieContent" style={{ flex: 2, padding: '16px' }}>
						<Progress
							className="movieProgress"
							type="circle"
							percent={vote * 10}
							format={customFormat}
							size={50}
							strokeColor={progressColor(vote)}
						/>
						<div className="movieTitle">{title}</div>
						<p className="movieDate">{transformDate}</p>
						<BadgesList list={genres} />
						<Typography.Paragraph
							ellipsis={{ rows: 4 }}
							style={{ marginBottom: 0 }}>
							{movieOverview}
						</Typography.Paragraph>
						<Rate
							className="rate"
							value={this.props.rating}
							count={10}
							onChange={this.onClisckRated}
						/>
					</div>
				</div>
			</Card>
		);
	}
}
