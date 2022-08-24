import React from 'react';
import { Link } from 'react-router-dom';

import './Footer.scss';

export default function Footer() {
	return (
		<div className="Footer">
			<footer>
				<p>
					Made with 🤍 and passion by{' '}
					<a href="https://github.com/barel31/" target="_blank" rel="noreferrer" aria-describedby="sad">
						barel31
					</a>
					<br />
					Submit your feedback: <Link to={'/feedback'}>Feedback</Link>
				</p>
			</footer>
		</div>
	);
}
