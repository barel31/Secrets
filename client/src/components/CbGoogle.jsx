import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../Context';

export default function CbGoogle() {
	const nav = useNavigate();

	const { toast } = useContext(Context);

	useEffect(() => {
		toast.success('Succesfully logged in with Google account.');
		nav('/secrets');
	}, []);

	return <>redirect...</>;
}
