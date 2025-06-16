function SummaryTab({ clients = [] }) {
	if (!Array.isArray(clients) || clients.length === 0) {
		return <div className="text-muted p-3">No data available for summary.</div>;
	}
	const total = clients.length;

	const thisMonth = clients.filter((c) => {
		const date = new Date(c.createdAt);
		const now = new Date();
		return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
	}).length;

	const ages = clients
		.map((c) => {
			const birth = new Date(c.dateOfBirth);
			const age = new Date().getFullYear() - birth.getFullYear();
			return isNaN(age) ? null : age;
		})
		.filter((a) => a !== null);

	const avgAge = ages.length ? (ages.reduce((a, b) => a + b) / ages.length).toFixed(1) : 'N/A';

	return (
		<div className="row text-center">
			<div className="col">
				<div className="card bg-light mb-2">
					<div className="card-body">
						<h4>{total}</h4>
						<p>Total Clients</p>
					</div>
				</div>
			</div>
			<div className="col">
				<div className="card bg-light mb-2">
					<div className="card-body">
						<h4>{thisMonth}</h4>
						<p>Added This Month</p>
					</div>
				</div>
			</div>
			<div className="col">
				<div className="card bg-light mb-2">
					<div className="card-body">
						<h4>{avgAge}</h4>
						<p>Average Age</p>
					</div>
				</div>
			</div>
		</div>
	);
}
export default SummaryTab;

