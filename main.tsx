import React from 'react'
import { createRoot } from 'react-dom/client'
import Game from './src/game/Game'
import './src/app/globals.css'

const root = createRoot(document.getElementById('root')!)
root.render(<Game />)
