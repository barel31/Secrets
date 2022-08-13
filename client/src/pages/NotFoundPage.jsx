import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
	return (
		<div className="Secrets">
			<h1 className="display-1">Page not found</h1>
			<Link to="/" className="btn btn-dark m-3">
				HOME
			</Link>
		</div>
	);
}
