import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57'];

function PieChartTab({ clients, field, title }) {
	if (!Array.isArray(clients) || clients.length === 0) {
		return <div className="text-muted p-3">No data available for {title.toLowerCase()}.</div>;
	}

	// Grouping counts by field (e.g. gender, region, createdAtMonth)
	const groupedCounts = clients.reduce((acc, client) => {
		const key = client[field] || 'Unknown';
		acc[key] = (acc[key] || 0) + 1;
		return acc;
	}, {});

	const data = Object.entries(groupedCounts).map(([name, value]) => ({ name, value }));

	return (
		<>
			<div className="text-center mb-4">
				<h5>{title}</h5>
				<ResponsiveContainer width="100%" height={300}>
					<PieChart>
						<Pie
							data={data}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							outerRadius={90}
							label
						>
							{data.map((_, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
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

export default PieChartTab;
