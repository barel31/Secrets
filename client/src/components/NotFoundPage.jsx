import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function NotFoundPage() {
	useEffect(() => {
		toast.error('Page not found');
	}, []);

	return (
		<div className="Secrets jumbotron centered">
			<div className="jumbotron text-center">
				<div className="container">
					<h1 className="display-1">Page not found</h1>
					<a href="/" className="btn btn-dark m-3">
						HOME
					</a>
				</div>
			</div>
		</div>
	);
}
