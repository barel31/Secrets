import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CallBack() {
	const nav = useNavigate();

	useEffect(() => {
		const path = window.location.href;
		const pathCutt = path.substring(path.indexOf('/callback/'));

		if (pathCutt.includes('/callback/google/success')) {
			toast.success('Succesfully logged in with Google account.');
		} else if (pathCutt.includes('/callback/facebook/success')) {
			toast.success('Succesfully logged in with Facebook account.');
		}

		if (pathCutt.includes('/callback/login/failed')) {
			toast.error('Login was failed.');
			nav('/login');
		} else nav('/secrets');
		// eslint-disable-next-line
	}, []);

	return <>redirect...</>;
}
