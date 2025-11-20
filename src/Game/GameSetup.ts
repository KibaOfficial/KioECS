// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Engine } from "../Engine/Core/Engine";
import { InputResource } from "../Engine/Resources/InputResource";
import { RenderResource } from "../Engine/Resources/RenderResource";
import { CollisionSystem } from "../Engine/Systems/ColissionSystem";
import { HealthSystem } from "../Engine/Systems/HealthSystem";
import { InputSystem } from "../Engine/Systems/InputSystem";
import { MovementSystem } from "../Engine/Systems/MovementSystem";
import { UIRenderSystem } from "../Engine/Systems/UIRenderSystem";
import { WorldRenderSystem } from "../Engine/Systems/WorldRenderSystem";
import { EnemyAISystem } from "./Systems/EnemyAISystem";
import { logger, setLogLevel } from "../utils/utils";

export class GameSetup {
  private name: string;
  private version: string;
  private author: string;
  private engine!: Engine;

  constructor(name: string, version: string, author: string) {
    this.name = name;
    this.version = version;
    this.author = author;
  }

  async initialize(): Promise<void> {
    setLogLevel('debug'); // Set log level to debug for detailed logs
    this.engine = new Engine(this.name, this.version, this.author);
    await this.engine.initialize();
    
    this.setupResources();
    this.setupSystems();
    this.createPlayer();
    this.createEnemies();
  }

  private setupResources(): void {
    logger("info", "Setting up resources...");
    const renderResource = new RenderResource("#game");
    this.engine.addResource("RenderResource", renderResource);
    
    const inputResource = new InputResource();
    this.engine.addResource("InputResource", inputResource);
    
    logger("info", "Resources initialized.");
  }

  private setupSystems(): void {
    logger("info", "Setting up game systems...");
    
    // Input must run first to capture keyboard state
    this.engine.registerSystem(new InputSystem());
    
    // AI logic (before movement so AI can set velocities)
    this.engine.registerSystem(new EnemyAISystem());
    
    // Then movement based on input/AI
    this.engine.registerSystem(new MovementSystem());

    // Collision detection
    this.engine.registerSystem(new CollisionSystem());
    
    // Game logic
    this.engine.registerSystem(new HealthSystem());
    
    // Rendering last
    this.engine.registerSystem(new WorldRenderSystem());
    this.engine.registerSystem(new UIRenderSystem());

    logger("info", "Game systems initialized.");
  }

  private createPlayer(): void {
    const renderResource = this.engine.getResource<RenderResource>("RenderResource");
    if (!renderResource) {
      throw new Error("RenderResource not found");
    }

    const player = this.engine.createEntity();
    this.engine.addComponent(player, "Position", { 
      x: renderResource.width / 2, 
      y: renderResource.height / 2 
    });
    this.engine.addComponent(player, "Health", { current: 100, max: 100 });
    this.engine.addComponent(player, "PlayerControlled", {});
    this.engine.addComponent(player, "Velocity", {
      x: 0,
      y: 0,
      speed: 200 // 200 pixels per second
    });
    this.engine.addComponent(player, "Renderable", {
      color: "#3b82f6",
      width: 30,
      height: 30,
      shape: "rect"
    });
    this.engine.addComponent(player, "Collider", {
      width: 30,
      height: 30,
      solid: true,
      layer: "player"
    });
    logger("info", `Created Player Entity with ID: ${player}`);
  }

  private createEnemies(): void {
    const renderResource = this.engine.getResource<RenderResource>("RenderResource");
    if (!renderResource) {
      throw new Error("RenderResource not found");
    }

    for (let i = 0; i < 5; i++) {
      const enemy = this.engine.createEntity();
      this.engine.addComponent(enemy, "Position", {
        x: Math.round(Math.random() * renderResource.width),
        y: Math.round(Math.random() * renderResource.height),
      });
      this.engine.addComponent(enemy, "Health", { current: 50, max: 50 });
      this.engine.addComponent(enemy, "Velocity", {
        x: 0,
        y: 0,
        speed: 100 // Enemies are slower than player (200)
      });
      this.engine.addComponent(enemy, "AI", {
        type: "chase",
        aggroRange: 300 // Chase player within 300 pixels
      });
      this.engine.addComponent(enemy, "Renderable", {
        color: "#ef4444",
        width: 25,
        height: 25,
        shape: "rect"
      });
      this.engine.addComponent(enemy, "Collider", {
        width: 25,
        height: 25,
        solid: true,
        layer: "enemy"
      });
      logger("info", `Created Enemy Entity with ID: ${enemy}`);
    }
    logger("info", "Created 5 Enemy Entities.");
  }

  start(): void {
    this.engine.start();
  }

  stop(): void {
    this.engine.stop();
  }
}
