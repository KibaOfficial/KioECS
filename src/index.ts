// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


import { GameSetup } from "./Game/GameSetup";
import './styles.css'

const App = async () => {
  const game = new GameSetup("KioECS Demo", "0.1.0", "KibaOfficial");
  await game.initialize();
  game.start();
}

App();
