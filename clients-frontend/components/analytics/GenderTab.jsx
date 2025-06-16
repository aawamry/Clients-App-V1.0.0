import PieChartTab from './PieChartTab';

function GenderTab({ clients }) {
	if (!Array.isArray(clients) || clients.length === 0) {
		return <div className="text-muted p-3">No data available for gender insights.</div>;
	}

	// Count genders
	const genderCounts = clients.reduce((acc, { gender }) => {
		acc[gender] = (acc[gender] || 0) + 1;
		return acc;
	}, {});

	const data = Object.entries(genderCounts).map(([name, value]) => ({ name, value }));

	return (
		<>
			<div className="text-center mb-4">
				<PieChartTab clients={clients} field="gender" title="Gender Distribution" />
			</div>
		</>
	);
}

export default GenderTab;
