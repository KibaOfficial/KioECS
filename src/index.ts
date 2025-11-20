// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT



import { Engine } from './Core/Engine';
import './styles.css'

const App = async () => {
  const gameDiv = document.querySelector<HTMLDivElement>('#game');

  if (!gameDiv) {
    throw new Error('App div not found');
  }

  const engine = new Engine(
    "Test",
    "1.0.0",
    "KibaOfficial"
  );
  await engine.initialize();
  engine.start();

}

App();
