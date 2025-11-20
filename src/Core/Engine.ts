// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { HealthSystem } from "../Systems/HealthSystem";
import { logger, sleep } from "../utils/utils";
import { ECS } from "./ECS";

export class Engine {
  private ecs: ECS;
  private name: string;
  private version: string;
  private author: string;
  private isRunning: boolean = false;

  constructor(name: string, version: string, author: string) {
    this.name = name;
    this.version = version;
    this.author = author;
    this.ecs = new ECS();
  }

  async initialize(): Promise<void> {
    logger("info", "Initializing ECS...");
    await sleep(1000);
    logger("info", `Starting ECS Game: ${this.name} v${this.version} by ${this.author}`);

    // Setup Systems
    this.setupSystems();

    // Create initial Entities
    this.createPlayer();
    this.createEnemies();
  }

  private setupSystems(): void {
    logger("info", "Setting up Systems...");
    this.ecs.addSystem(new HealthSystem());
    // TODO: Add and Create Input, Physics and Main Render Systems

    logger("info", "Systems initialized.");
  }

  private createPlayer(): void {
    const player = this.ecs.createEntity();
    this.ecs.addComponent(player, "Position", { x: 0, y: 0 });
    this.ecs.addComponent(player, "Health", { current: 100, max: 100 });
    this.ecs.addComponent(player, "PlayerControlled", {});
    logger("info", `Created Player Entity with ID: ${player}`);
  }

  private createEnemies(): void {
    for (let i = 0; i < 5; i++) {
      const enemy = this.ecs.createEntity();
      this.ecs.addComponent(enemy, "Position", {
        x: Math.round(Math.random() * 800),
        y: Math.round(Math.random() * 600),
      });
      this.ecs.addComponent(enemy, "Health", { current: 50, max: 50 });
      logger("info", `Created Enemy Entity with ID: ${enemy} at Position: ${JSON.stringify(this.ecs.getComponent(enemy, "Position"))}`);
    }
    logger("info", "Created 5 Enemy Entities.");
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    logger("info", "Starting game loop...");
    this.gameLoop();
  }

  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    logger("info", "Game stopped.");
  }

  private gameLoop(): void {
    let lastTime = performance.now();

    const loop = (timestamp: number) => {
      const deltaTime = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      this.ecs.update(deltaTime);

      // Nur weitermachen, wenn Engine läuft
      if (this.isRunning) {
        requestAnimationFrame(loop);
      }
    };

    this.isRunning = true;
    requestAnimationFrame(loop);
  }

  // Public API to access ECS instance
  getECS(): ECS {
    return this.ecs;
  }
}