// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ComponentMap } from "../Components/Component";
import { Entity } from "../Entities/Entity";
import { System } from "../Systems/System";
import { logger } from "../utils/utils";

export class ECS {
  // Internal ECS States
  private nextEntityId: number = 0;
  private entities: Set<Entity> = new Set();
  private components: Map<string, Map<Entity, any>> = new Map();
  private systems: System[] = [];

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
      logger("info", `Initialized component storage for type: ${componentType}`);
    }
    this.components.get(componentType)!.set(entity, data);
    logger("info", `Added component ${componentType} to entity ${entity}`);
  }

  getComponent<K extends keyof ComponentMap>(
    entity: Entity,
    componentType: K
  ): ComponentMap[K] | undefined {
    return this.components.get(componentType)?.get(entity);
  }

  addSystem(system: System): void {
    this.systems.push(system);
    logger("info", `Added system: ${system.constructor.name}`);
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
}