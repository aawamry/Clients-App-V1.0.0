import PieChartTab from './PieChartTab';

function GenderTab({ clients }) {
	if (!Array.isArray(clients) || clients.length === 0) {
		return <div className="text-muted p-3">No data available for gender insights.</div>;
	}

	const genderCounts = clients.reduce((acc, { gender }) => {
		acc[gender] = (acc[gender] || 0) + 1;
		return acc;
	}, {});

	const data = Object.entries(genderCounts).map(([name, value]) => ({ name, value }));

	return (
		<>
			<div className="text-center mb-4">
				<PieChartTab data={data} title="Gender Distribution" />
			</div>

			<div className="row text-center">
				{data.map(({ name, value }) => (
					<div className="col" key={name}>
						<div className="card bg-light mb-2">
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

export default GenderTab;
