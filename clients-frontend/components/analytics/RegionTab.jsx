function RegionTab({ clients }) {
	if (!Array.isArray(clients) || clients.length === 0) {
		return <div className="text-muted p-3">No data available for summary.</div>;
	}
	const regionMap = {};

	clients.forEach((client) => {
		const region = client.region || 'Unknown';
		regionMap[region] = (regionMap[region] || 0) + 1;
	});

	return (
		<ul className="list-group">
			{Object.entries(regionMap).map(([region, count]) => (
				<li key={region} className="list-group-item d-flex justify-content-between">
					<span>{region}</span>
					<span>{count}</span>
				</li>
			))}
		</ul>
	);
}

export default RegionTab;
