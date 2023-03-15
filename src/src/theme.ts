import { createTheme } from "@mui/material";

const _theme = {
	background: {
		layer0: "#202225",
		layer1: "#2f3136",
		layer2: "#36393f"
	},
	colors: {
		primary: "#1e88e5",
		secondary: "#00b0ff"
	}
};

export const muiTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: _theme.colors.primary,
		},
		secondary: {
			main: _theme.colors.secondary,
		},
		background: {
			default: _theme.background.layer0,
			paper: _theme.background.layer0,
		},
	},
});

export const theme = {
	muiTheme,
	..._theme
}