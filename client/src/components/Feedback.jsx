import React from 'react';
import { Link } from 'react-router-dom';

export default function Feedback() {
	return (
		<div className="Secrets jumbotron centered">
			<div className="jumbotron text-center">
				<div className="container">
					<i className="fas fa-key fa-6x" />
					<h1 className="display-1">Feedback</h1>
					<h3 className="display-3">Soon</h3>
					<Link to="/" className="btn btn-dark m-3">
						HOME
					</Link>
				</div>
			</div>
		</div>
	);
}
