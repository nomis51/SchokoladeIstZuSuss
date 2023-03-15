import './Controls.css';
import { ArrowBack, ArrowDownward, ArrowForward, ArrowUpward } from '@mui/icons-material';
import { Button, Card, CardContent, CardHeader, Divider, MenuItem, Select, Stack, TextField, useEventCallback } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useCallback, useEffect, useState } from 'react';
import { GameService } from '../../services/game.service';
import { ConfigService } from '../../services/config.service';

const Controls = () => {
	const [updateLoop, setUpdateLoop] = useState(null as any);
	const [isConnected, setIsConnected] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const [mapChangeDetails, setMapChangeDetails] = useState('');
	const [items, setItems] = useState(ConfigService.items);
	const [selectedItemId, setSelectedItemId] = useState(11);

	useEffect(() => {
		if (updateLoop) {
			clearInterval(updateLoop);
		}
		setUpdateLoop(
			setInterval(() => {
				setIsConnected(GameService.isConnected);
				setIsLoggedIn(GameService.isLoggedIn);
				setIsReady(GameService.isReady);
			}, 1000)
		);
		return () => {
			clearInterval(updateLoop);
		};
	}, []);

	const login = useCallback(() => {
		if (!isConnected || isLoggedIn) return;

		const cfg = ConfigService.retrieveConfig();
		GameService.login({
			userId: cfg.userInfo.id,
			username: cfg.userInfo.username,
			hashedPassword: cfg.userInfo.hashedPassword,
			zone: cfg.serverInfo.zone,
			rs: cfg.serverInfo.rs,
			version: cfg.serverInfo.version,
		})
	}, [isConnected, isLoggedIn]);
	const connect = useCallback(() => {
		if (isConnected) return;

		const cfg = ConfigService.retrieveConfig();
		GameService.connect({
			host: cfg.serverInfo.host,
			port: cfg.serverInfo.port,
			useSsl: cfg.serverInfo.useSsl,
		});
	}, [isConnected]);
	const changeMap = useCallback(() => {
		const [id, x, y] = mapChangeDetails.split(',');
		GameService.changeMap({
			id: parseInt(id),
			x: parseInt(x),
			y: parseInt(y),
		});
	}, [mapChangeDetails])

	return (
		<div className="controls">
			<Card>
				<CardHeader title="Controls" />
				<CardContent>
					<Grid2 container spacing={2}>
						<Grid2>
							<h3>Connection / Login</h3>
							<Stack spacing={1}>
								<Button variant='contained' color={isConnected ? 'error' : 'success'} onClick={() => isConnected ? (GameService.disconnect(), location.reload()) : connect()}>
									1 - {isConnected ? 'Disconnect' : 'Connect'}
								</Button>
								<Button variant='contained' color="success" disabled={isLoggedIn} onClick={() => login()}>
									2 - Login
								</Button>
								<Button variant='contained' color="success" disabled={isReady} onClick={() => GameService.sendReady()}>
									3 - Send ready
								</Button>
							</Stack>
						</Grid2>
						<Grid2>
							<Divider orientation='vertical' />
						</Grid2>
						<Grid2>
							<h3>Movements</h3>
							<table>
								<tbody>
									<tr>
										<td colSpan={3}
											align="center">
											<Button variant="contained"
												onClick={() => GameService.movePlayer({
													direction: 'up'
												})}>
												<ArrowUpward />
											</Button>
										</td>
									</tr>
									<tr>
										<td>
											<Button variant="contained"
												onClick={() => GameService.movePlayer({
													direction: 'left'
												})}>
												<ArrowBack />
											</Button>
										</td>
										<td>
											<Button variant="contained"
												onClick={() => GameService.movePlayer({
													direction: 'down'
												})}>
												<ArrowDownward />
											</Button>
										</td>
										<td>
											<Button variant="contained"
												onClick={() => GameService.movePlayer({
													direction: 'right'
												})}>
												<ArrowForward />
											</Button>
										</td>
									</tr>
								</tbody>
							</table>
						</Grid2>
						<Grid2>
							<Divider orientation='vertical' />
						</Grid2>
						<Grid2>
							<h3>Change map</h3>
							<TextField id="map-select" label="Map (id,x,y)" value={mapChangeDetails} onChange={e => setMapChangeDetails(e.target.value)} />
							<br></br>
							<Button sx={{ mt: 1 }} variant="contained" onClick={() => changeMap()}>Change map</Button>
						</Grid2>
						<Grid2>
							<Divider orientation='vertical' />
						</Grid2>
						<Grid2>
							<h3>Battle moves</h3>
							<table>
								<tbody>
									<tr>
										<td align="center">
											<Button variant="contained"
												onClick={() => GameService.doBattleAction({ moveNum: 1 })}>
												Move 1
											</Button>
										</td>
										<td>
											<Button variant="contained"
												onClick={() => GameService.doBattleAction({ moveNum: 2 })}>
												Move 2
											</Button>
										</td>
									</tr>
									<tr>
										<td>
											<Button variant="contained"
												onClick={() => GameService.doBattleAction({ moveNum: 3 })}>
												Move 3
											</Button>
										</td>
										<td>
											<Button variant="contained"
												onClick={() => GameService.doBattleAction({ moveNum: 4 })}>
												Move 4
											</Button>
										</td>
									</tr>
								</tbody>
							</table>
						</Grid2>
						<Grid2>
							<Divider orientation='vertical' />
						</Grid2>
						<Grid2>
							<h3>Battle actions</h3>
							{/* I believe each item has an ID. Here small potion is 11 */}
							{/* See data/items.json */}
							<Select sx={{ mb: 1, mr: 1 }} label="Item" value={selectedItemId} onChange={e => setSelectedItemId(Number(e.target.value))}>
								{items.map(item => (
									<MenuItem key={item.id} value={item.id}>
										{item.name}
									</MenuItem>
								))}
							</Select>
							<Button variant="contained" color="error"
								onClick={() => GameService.doBattleAction({ doRun: true })}>
								Run
							</Button>
							<br />
							<Button variant="contained"
								onClick={() => GameService.doBattleAction({ itemId: selectedItemId })}>
								Use item
							</Button>
						</Grid2>
					</Grid2>
				</CardContent>
			</Card>
		</div >
	);
}

export default Controls;