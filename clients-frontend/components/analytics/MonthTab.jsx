
function MonthTab({ clients }) {
	if (!Array.isArray(clients) || clients.length === 0) {
		return <div className="text-muted p-3">No data available for month analysis.</div>;
	}

	// Replace `createdAt` with your actual date field
	const monthCounts = {};

	clients.forEach(client => {
		const date = new Date(client.created_at); // fallback if `createdAt` doesn't exist
		if (!isNaN(date)) {
			const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
			monthCounts[month] = (monthCounts[month] || 0) + 1;
		}
	});

	const sortedMonths = Object.entries(monthCounts).sort((a, b) => {
		const aDate = new Date(`1 ${a[0]}`);
		const bDate = new Date(`1 ${b[0]}`);
		return aDate - bDate;
	});

	return (
		<div className="p-3">
			<h5>Clients by Month</h5>
			<ul className="list-group">
				{sortedMonths.map(([month, count]) => (
					<li key={month} className="list-group-item d-flex justify-content-between">
						<span>{month}</span>
						<span className="badge bg-primary rounded-pill">{count}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

export default MonthTab;
