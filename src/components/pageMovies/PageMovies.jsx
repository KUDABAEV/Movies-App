import React from 'react';
import { Tabs } from 'antd';

import TabRating from '../tabRating/TabRating';
import TabSearch from '../tabSearch/TabSearch';
import { SessionService } from '../../api/SessionService.js';

export default class PageMovies extends React.Component {
	componentDidMount() {
		SessionService.initTokenGuestSession();
	}

	render() {
		const tabs = [
			{
				key: '1',
				label: 'Search',
				children: <TabSearch />,
			},
			{
				key: '2',
				label: 'Rated',
				children: <TabRating />,
			},
		];

		return (
			<div className="container">
				<Tabs
					centered={true}
					items={tabs}
					defaultActiveKey="1"
					destroyInactiveTabPane
				/>
			</div>
		);
	}
}
