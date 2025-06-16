import { useState } from 'react';

const tabLabels = ['Summary', 'By Gender', 'By Region', 'By Month'];

function AnalyticsTabs({ children }) {
	
	const [activeTab, setActiveTab] = useState(0);

	return (
		<div className="mt-4">
			<ul className="nav nav-tabs">
				{tabLabels.map((label, index) => (
					<li className="nav-item" key={label}>
						<button
							className={`nav-link ${activeTab === index ? 'active' : ''}`}
							onClick={() => setActiveTab(index)}
						>
							{label}
						</button>
					</li>
				))}
			</ul>
			<div className="tab-content mt-3">{children[activeTab]}</div>
		</div>
	);
}

export default AnalyticsTabs;
