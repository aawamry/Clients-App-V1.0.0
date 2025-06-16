import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
	if (totalPages <= 1) return null;

	const handleClick = (page) => {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
		}
	};

	return (
		<nav>
			<ul className="pagination justify-content-center mb-0">
				<li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
					<button className="page-link" onClick={() => handleClick(currentPage - 1)}>
						Previous
					</button>
				</li>
				{[...Array(totalPages)].map((_, index) => (
					<li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
						<button className="page-link" onClick={() => handleClick(index + 1)}>
							{index + 1}
						</button>
					</li>
				))}
				<li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
					<button className="page-link" onClick={() => handleClick(currentPage + 1)}>
						Next
					</button>
				</li>
			</ul>
		</nav>
	);
}

export default Pagination;
