import './App.css'
import { useState } from 'react'
import { Button, CssBaseline, ThemeProvider } from '@mui/material'
import { muiTheme } from './theme'
import { GameService } from './services/game.service'
import { ArrowBack, ArrowDownward, ArrowForward, ArrowUpward } from '@mui/icons-material'
import { ConfigService } from './services/config.service'
import Informations from './components/Informations/Informations'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import Controls from './components/Controls/Controls'

function App() {
  const [mapChange, setMapChange] = useState('');
  ConfigService.retrieveConfig();

  return (
    <div className="App">
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <main>
          <Grid2 container>
            <Grid2>
              <Informations />
            </Grid2>
          </Grid2>
          <Grid2 container>
            <Grid2>
              <Controls />
            </Grid2>
          </Grid2>
        </main>
      </ThemeProvider>
    </div>
  )
}

export default App
