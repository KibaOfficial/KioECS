// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { logger } from "../../shared/logger";
import { ComponentMap } from "../Components/Component";
import { Entity } from "../Entities/Entity";
import { System } from "../Systems/System";

export class ECS {
  // Internal ECS States
  private nextEntityId: number = 0;
  private entities: Set<Entity> = new Set();
  private components: Map<string, Map<Entity, any>> = new Map();
  private systems: System[] = [];
  private resources: Map<string, any> = new Map();

  createEntity(): Entity {
    const id = this.nextEntityId++;
    this.entities.add(id);
    return id;
  }

  addComponent<K extends keyof ComponentMap>(
    entity: Entity,
    componentType: K,
    data: ComponentMap[K]
  ): void {
    if (!this.components.has(componentType)) {
      this.components.set(componentType, new Map());
      logger("debug", `Initialized component storage for type: ${componentType}`);
    }
    this.components.get(componentType)!.set(entity, data);
    logger("debug", `Added component ${componentType} to entity ${entity}`);
  }

  getComponent<K extends keyof ComponentMap>(
    entity: Entity,
    componentType: K
  ): ComponentMap[K] | undefined {
    return this.components.get(componentType)?.get(entity);
  }

  hasComponent<K extends keyof ComponentMap>(
    entity: Entity,
    componentType: K
  ): boolean {
    return this.components.get(componentType)?.has(entity) ?? false;
  }

  addSystem(system: System): void {
    this.systems.push(system);
    logger("debug", `Added system: ${system.constructor.name}`);
  }

  update(deltaTime: number): void {
    for (const system of this.systems) {
      system.update(this, deltaTime);
    }
  }

  public query<K extends keyof ComponentMap>(
    ...componentTypes: K[]
  ): Entity[] {
    return Array.from(this.entities).filter(entity => {
      return componentTypes.every(type =>
        this.components.get(type)?.has(entity)
      );
    });
  }

  destroyEntity(entity: Entity): void {
    // Remove all components from this entity
    for (const storage of this.components.values()) {
      storage.delete(entity);
    }
    // Remove entity from entity set
    this.entities.delete(entity);
    logger("warn", `Entity ${entity} destroyed`);
  }

  // Resource Management
  addResource<T>(name: string, resource: T): void {
    this.resources.set(name, resource);
    logger("debug", `Added resource: ${name}`);
  }

  getResource<T>(name: string): T | undefined {
    return this.resources.get(name) as T | undefined;
  }

  hasResource(name: string): boolean {
    return this.resources.has(name);
  }
}