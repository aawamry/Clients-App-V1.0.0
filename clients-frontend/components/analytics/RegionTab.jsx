import PieChartTab from './PieChartTab';

function RegionTab({ clients }) {
	if (!Array.isArray(clients) || clients.length === 0) {
		return <div className="text-muted p-3">No data available for region insights.</div>;
	}

	// Count clients per region
	const regionCounts = clients.reduce((acc, { region }) => {
		if (!region) return acc;
		acc[region] = (acc[region] || 0) + 1;
		return acc;
	}, {});

	const data = Object.entries(regionCounts).map(([name, value]) => ({ name, value }));

	return (
		<div className="row">
			{/* Summary cards column */}
			<div className="col-md-4 d-flex align-items-center">
				<div className="row w-100 text-center">
					{data.map(({ name, value }) => (
						<div className="col-12 mb-2" key={name}>
							<div className="card bg-light">
								<div className="card-body">
									<h4>{value}</h4>
									<p>{name}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Chart column */}
			<div className="col-md-8 text-center mb-4">
				<h5>Region Distribution</h5>
				<PieChartTab data={data} title="Region Distribution" />
			</div>
		</div>
	);
}

export default RegionTab;
