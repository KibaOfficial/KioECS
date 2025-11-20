// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ECS } from "../../Engine/Core/ECS";
import { System } from "../../Engine/Systems/System";
import { logger } from "../../utils/utils";

export class EnemyAISystem extends System {
  update(ecs: ECS, deltaTime: number): void {
    // Find player
    const players = ecs.query("PlayerControlled", "Position");
    if (players.length === 0) return;

    const player = players[0];
    const playerPos = ecs.getComponent(player, "Position")!;

    // Process all enemies with AI
    const enemies = ecs.query("AI", "Position", "Velocity");

    for (const enemy of enemies) {
      const ai = ecs.getComponent(enemy, "AI")!;
      const pos = ecs.getComponent(enemy, "Position")!;
      const vel = ecs.getComponent(enemy, "Velocity")!;

      // Calculate distance to player
      const dx = playerPos.x - pos.x;
      const dy = playerPos.y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      switch (ai.type) {
        case "chase":
          this.chaseTarget(ai, vel, dx, dy, distance);
          break;
        case "wander":
          this.wander(ai, vel, deltaTime);
          break;
        case "idle":
          vel.x = 0;
          vel.y = 0;
          break;
      }
    }
  }

  private chaseTarget(
    ai: any,
    vel: any,
    dx: number,
    dy: number,
    distance: number
  ): void {
    if (distance < ai.aggroRange && distance > 0) {
      // Normalize direction and apply speed
      vel.x = (dx / distance) * vel.speed;
      vel.y = (dy / distance) * vel.speed;
      
      if (!ai.target) {
        logger("debug", "Enemy aggro'd on player!");
      }
      ai.target = 0; // Player entity ID
    } else {
      // Out of range, stop
      vel.x = 0;
      vel.y = 0;
      if (ai.target !== undefined) {
        logger("debug", "Enemy lost aggro");
        ai.target = undefined;
      }
    }
  }

  private wander(ai: any, vel: any, deltaTime: number): void {
    // Simple wander behavior
    if (!ai.wanderTimer || ai.wanderTimer <= 0) {
      // Pick random direction
      const angle = Math.random() * Math.PI * 2;
      vel.x = Math.cos(angle) * vel.speed * 0.3; // 30% of max speed
      vel.y = Math.sin(angle) * vel.speed * 0.3;
      ai.wanderTimer = 2 + Math.random() * 3; // 2-5 seconds
    } else {
      ai.wanderTimer -= deltaTime;
    }
  }
}
