import { Card, CardContent, CardHeader, TextField } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import { GameService } from '../../services/game.service';
import './Informations.css';

const Informations = () => {
	const [updateLoop, setUpdateLoop] = useState(null as any);
	const [status, setStatus] = useState('Not connected');
	const [map, setMap] = useState('');
	const [position, setPosition] = useState('');

	useEffect(() => {
		if (updateLoop) {
			clearInterval(updateLoop);
		}
		setUpdateLoop(
			setInterval(() => {
				setStatus(
					(GameService.isConnected ? 'Connected' : 'Not connected') +
					(GameService.isReady ? ' (ready)' : (GameService.isLoggedIn ? ' (login)' : ''))
				);
				setMap(`${GameService.currentMap?.name || 'Unknown'} (${GameService.currentMap?.id || 0})`);
				setPosition(`${GameService.player?.position.x}, ${GameService.player?.position.y}`);
			}, 500)
		);
		return () => {
			clearInterval(updateLoop);
		};
	}, []);

	return (
		<div className="informations">
			<Card>
				<CardHeader title="Informations" />
				<CardContent>
					<Grid2 container spacing={1}>
						<Grid2>
							<TextField fullWidth label="Status" variant="outlined" value={status} />
						</Grid2>
						<Grid2>
							<TextField fullWidth label="Map" variant="outlined" value={map} />
						</Grid2>
						<Grid2>
							<TextField fullWidth label="Position" variant="outlined" value={position} />
						</Grid2>
					</Grid2>
				</CardContent>
			</Card>
		</div>
	)
}

export default Informations;