// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ECS } from "../Core/ECS";
import { logger } from "../../utils/utils";
import { System } from "./System";

export class HealthSystem extends System {
  update(ecs: ECS, deltaTime: number): void {
    // 1. Get all entities with Health component
    const entities = ecs.query("Health");

    // Collect dead entities to destroy after iteration
    const deadEntities: number[] = [];

    // 2. Iterate over each entity that has a Health component
    for (const entity of entities) {
      const health = ecs.getComponent(entity, "Health");

      // Skip if health component doesn't exist (type safety)
      if (!health) continue;

      // 3. If health is below or equal to 0, mark for destruction
      if (health.current <= 0) {
        logger("warn", `Entity ${entity} died!`);
        deadEntities.push(entity);
        continue;
      }

      // Example logic: Regenerate health over time (only if alive!)
      if (health.current < health.max) {
        health.current = Math.min(health.current + 1 * deltaTime, health.max);
        health.current = Math.round(health.current * 100) / 100;
        logger(
          "debug",
          `Entity ${entity} health regenerated to ${health.current}/${health.max} HP.`
        );
      }
    }

    // Destroy all dead entities
    for (const entity of deadEntities) {
      ecs.destroyEntity(entity);
    }
  }
}
