import { useEffect, useState } from 'react';
import { getAllClients } from '../services/clientService';

import AnalyticsTabs from '../components/analytics/AnalyticsTabs';
import SummaryTab from '../components/analytics/SummaryTab';
import GenderTab from '../components/analytics/GenderTab';
import RegionTab from '../components/analytics/RegionTab';
import MonthTab from '../components/analytics/MonthTab';

function AnalyticsPage() {
	const [loading, setLoading] = useState(true);
	const [clients, setClients] = useState([]);

	useEffect(() => {
		const fetchClients = async () => {
			try {
				const data = await getAllClients();
				setClients(data);
			} catch (err) {
				console.error('Failed to load clients:', err);
			} finally {
				setLoading(false);
			}
		};
		fetchClients();
	}, []);

	if (loading) return <div>Loading analytics...</div>;

	return (
		<div className="container mt-4">
			<h3>Client Analytics</h3>
			<AnalyticsTabs>
				<SummaryTab clients={clients} />
				<GenderTab clients={clients} />
				<RegionTab clients={clients} />
				<MonthTab clients={clients} />
			</AnalyticsTabs>
		</div>
	);
}

export default AnalyticsPage;
