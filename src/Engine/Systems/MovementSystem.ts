// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ECS } from "../Core/ECS";
import { System } from "./System";

export class MovementSystem extends System {
  update(ecs: ECS, deltaTime: number): void {
    // Query all entities with Position and Velocity
    const entities = ecs.query("Position", "Velocity");

    for (const entity of entities) {
      const pos = ecs.getComponent(entity, "Position")!;
      const vel = ecs.getComponent(entity, "Velocity")!;

      // Update position based on velocity and deltaTime
      pos.x += vel.x * deltaTime;
      pos.y += vel.y * deltaTime;
    }
  }
}
