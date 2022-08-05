import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../Context';

export default function Logout() {
	const nav = useNavigate();

	const { logInOutHandler } = useContext(Context);

	useEffect(() => {
		logInOutHandler();
		nav('/');
	}, []);
}
