import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function NotFoundPage() {
	return (
		<div className="Secrets jumbotron centered">
			<div className="jumbotron text-center">
				<div className="container">
					<i className="fas fa-key fa-6x" />
					<h1 className="display-1">Page not found</h1>
					<Link to="/" className="btn btn-dark m-3">
						HOME
					</Link>
				</div>
			</div>
		</div>
	);
}
