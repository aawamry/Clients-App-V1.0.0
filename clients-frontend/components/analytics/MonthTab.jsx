import PieChartTab from './PieChartTab';

function MonthTab({ clients }) {
	if (!Array.isArray(clients) || clients.length === 0) {
		return <div className="text-muted p-3">No data available for month insights.</div>;
	}

	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	// Count clients grouped by creation month
	const monthCounts = clients.reduce((acc, { created_at }) => {
		if (!created_at) return acc;
		const monthIndex = new Date(created_at).getMonth();
		const monthName = monthNames[monthIndex];
		acc[monthName] = (acc[monthName] || 0) + 1;
		return acc;
	}, {});

	const data = Object.entries(monthCounts).map(([name, value]) => ({ name, value }));

	return (
		<>
			<div className="text-center mb-4">
				<h5>Clients Created per Month</h5>
				<PieChartTab data={data} title="Created At - Monthly Distribution" />
			</div>

			<div className="row text-center">
				{data.map(({ name, value }) => (
					<div className="col-md-3 col-sm-6 mb-2" key={name}>
						<div className="card bg-light">
							<div className="card-body">
								<h4>{value}</h4>
								<p>{name}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
}

export default MonthTab;
