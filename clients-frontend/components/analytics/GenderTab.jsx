function GenderTab({ clients }) {
	if (!Array.isArray(clients) || clients.length === 0) {
		return <div className="text-muted p-3">No data available for summary.</div>;
	}
	const count = (gender) => clients.filter((c) => c.gender === gender).length;
	return (
		<div className="row text-center">
			<div className="col">
				<div className="card bg-light mb-2">
					<div className="card-body">
						<h4>{count('Male')}</h4>
						<p>Male</p>
					</div>
				</div>
			</div>
			<div className="col">
				<div className="card bg-light mb-2">
					<div className="card-body">
						<h4>{count('Female')}</h4>
						<p>Female</p>
					</div>
				</div>
			</div>
			<div className="col">
				<div className="card bg-light mb-2">
					<div className="card-body">
						<h4>{count('Other')}</h4>
						<p>Other</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default GenderTab;
