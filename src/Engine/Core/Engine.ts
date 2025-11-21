// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ECS } from "./ECS";
import { System } from "../Systems/System";
import { Entity } from "../Entities/Entity";
import { ComponentMap } from "../Components/Component";
import { logger } from "../../shared/logger";
import { sleep } from "../../shared/sleep";

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
    logger("info", "Initializing Engine...");
    await sleep(1000);
    logger("info", `Engine ready: ${this.name} v${this.version} by ${this.author}`);
  }

  // Engine API - System Management
  registerSystem(system: System): void {
    this.ecs.addSystem(system);
    logger("info", `Registered System: ${system.constructor.name}`);
  }

  // Engine API - Entity Management
  createEntity(): Entity {
    return this.ecs.createEntity();
  }

  // Engine API - Component Management
  addComponent<K extends keyof ComponentMap>(
    entity: Entity,
    componentType: K,
    data: ComponentMap[K]
  ): void {
    this.ecs.addComponent(entity, componentType, data);
  }

  getComponent<K extends keyof ComponentMap>(
    entity: Entity,
    componentType: K
  ): ComponentMap[K] | undefined {
    return this.ecs.getComponent(entity, componentType);
  }

  hasComponent<K extends keyof ComponentMap>(
    entity: Entity,
    componentType: K
  ): boolean {
    return this.ecs.hasComponent(entity, componentType);
  }

  // Engine API - Query Entities
  query<K extends keyof ComponentMap>(...componentTypes: K[]): Entity[] {
    return this.ecs.query(...componentTypes);
  }

  // Engine API - Destroy Entity
  destroyEntity(entity: Entity): void {
    this.ecs.destroyEntity(entity);
  }

  // Engine API - Resource Management
  addResource<T>(name: string, resource: T): void {
    this.ecs.addResource(name, resource);
  }

  getResource<T>(name: string): T | undefined {
    return this.ecs.getResource<T>(name);
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

      // Continue only if engine is running
      if (this.isRunning) {
        requestAnimationFrame(loop);
      }
    };

    requestAnimationFrame(loop);
  }

  // Public API to access ECS instance
  getECS(): ECS {
    return this.ecs;
  }
}