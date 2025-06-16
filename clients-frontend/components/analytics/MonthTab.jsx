import PieChartTab from './PieChartTab';

function MonthTab({ clients }) {
	if (!Array.isArray(clients)) {
		return <div className="text-muted p-3">No data available for month insights.</div>;
	}

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
		'December'
	];

	// Step 1: Initialize all months to 0
	const monthCounts = monthNames.reduce((acc, month) => {
		acc[month] = 0;
		return acc;
	}, {});

	// Step 2: Count clients per month
	clients.forEach(({ created_at }) => {
		if (created_at) {
			const monthIndex = new Date(created_at).getMonth();
			const monthName = monthNames[monthIndex];
			monthCounts[monthName]++;
		}
	});

	// Step 3: Build full summary (12 months) and chart data (only months with > 0)
	const summaryData = Object.entries(monthCounts).map(([name, value]) => ({ name, value }));
	const chartData = summaryData.filter((item) => item.value > 0);

	// Split summary into two columns
	const mid = Math.ceil(summaryData.length / 2);
	const firstCol = summaryData.slice(0, mid);
	const secondCol = summaryData.slice(mid);

	return (
		<div className="row">
			{/* Summary in 2 columns */}
			<div className="col-md-4 d-flex align-items-center">
				<div className="row w-100 text-center">
					<div className="col-6">
						{firstCol.map(({ name, value }) => (
							<div className="card bg-light mb-2" key={name}>
								<div className="card-body py-2 px-3">
									<h5 className="mb-1">{value}</h5>
									<p className="mb-0 small">{name}</p>
								</div>
							</div>
						))}
					</div>
					<div className="col-6">
						{secondCol.map(({ name, value }) => (
							<div className="card bg-light mb-2" key={name}>
								<div className="card-body py-2 px-3">
									<h5 className="mb-1">{value}</h5>
									<p className="mb-0 small">{name}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			{/* Chart section */}
			<div className="col-md-8 mb-4">
				<PieChartTab data={chartData} title="Clients Created per Month" />
			</div>
		</div>
	);
}

export default MonthTab;
