// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { logger } from "../../utils/utils";
import { ECS } from "../Core/ECS";
import { System } from "./System";

export class CollisionSystem extends System {
  update(ecs: ECS, deltaTime: number): void {
    // Update cooldown timers first
    const cooldownEntities = ecs.query("DamageCooldown");
    for (const entity of cooldownEntities) {
      const cooldown = ecs.getComponent(entity, "DamageCooldown")!;
      if (cooldown.timer > 0) {
        cooldown.timer -= deltaTime;
      }
    }

    // Query all entities with Position and Collider components
    const entities = ecs.query("Position", "Collider");

    for (let i = 0; i < entities.length; i++) {
      const entityA = entities[i];
      const posA = ecs.getComponent(entityA, "Position")!;
      const colA = ecs.getComponent(entityA, "Collider")!;

      for (let j = i + 1; j < entities.length; j++) {
        const entityB = entities[j];
        const posB = ecs.getComponent(entityB, "Position")!;
        const colB = ecs.getComponent(entityB, "Collider")!;

        // AABB Collision Detection
        if (this.checkAABB(posA, colA, posB, colB)) {
          // Handle collision
          this.handleCollision(ecs, entityA, entityB);
        }
      }
    }
  }

  private checkAABB(
    posA: { x: number; y: number },
    colA: { width: number; height: number },
    posB: { x: number; y: number },
    colB: { width: number; height: number }
  ): boolean {
    return (
      posA.x < posB.x + colB.width &&
      posA.x + colA.width > posB.x &&
      posA.y < posB.y + colB.height &&
      posA.y + colA.height > posB.y
    );
  }

  private handleCollision(ecs: ECS, entityA: number, entityB: number): void {
    logger("debug", `Collision: Entity ${entityA} ↔ Entity ${entityB}`);

    const isPlayerA = ecs.hasComponent(entityA, "PlayerControlled");
    const isPlayerB = ecs.hasComponent(entityB, "PlayerControlled");

    // Player vs Enemy collision
    if (isPlayerA || isPlayerB) {
      const player = isPlayerA ? entityA : entityB;

      let cooldown = ecs.getComponent(player, "DamageCooldown");
      if (!cooldown) {
        // Add cooldown component if it doesn't exist
        ecs.addComponent(player, "DamageCooldown", { timer: 0, duration: 1.0 });
        cooldown = ecs.getComponent(player, "DamageCooldown")!;
      }

      if (cooldown.timer > 0) {
        return; // still in cooldown
      }

      const health = ecs.getComponent(player, "Health");
      if (health && health.current > 0) {
        health.current -= 10;
        cooldown.timer = cooldown.duration; // Reset cooldown
        logger(
          "warn",
          `Player ${player} took damage! Health: ${health.current}/${health.max}`
        );
      }

      this.seperateEntities(ecs, entityA, entityB);
    }
  }

  private seperateEntities(ecs: ECS, entityA: number, entityB: number): void {
    const posA = ecs.getComponent(entityA, "Position")!;
    const posB = ecs.getComponent(entityB, "Position")!;
    const colA = ecs.getComponent(entityA, "Collider")!;
    const colB = ecs.getComponent(entityB, "Collider")!;

    // calculate overlap
    const overlapX =
      (colA.width + colB.width) / 2 -
      Math.abs(posA.x + colA.width / 2 - (posB.x + colB.width / 2));
    const overlapY =
      (colA.height + colB.height) / 2 -
      Math.abs(posA.y + colA.height / 2 - (posB.y + colB.height / 2));

    // push apart on smallest overlap axis
    if (overlapX < overlapY) {
      // seperate on x axis
      if (posA.x < posB.x) {
        posA.x -= overlapX / 2;
        posB.x += overlapX / 2;
      } else {
        posA.x += overlapX / 2;
        posB.x -= overlapX / 2;
      }
    } else {
      // seperate on y axis
      if (posA.y < posB.y) {
        posA.y -= overlapY / 2;
        posB.y += overlapY / 2;
      } else {
        posA.y += overlapY / 2;
        posB.y -= overlapY / 2;
      }
    }
  }
}
