// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ECS } from "../Core/ECS";
import { InputResource } from "../Resources/InputResource";
import { System } from "./System";

export class InputSystem extends System {
  update(ecs: ECS, _deltaTime: number): void {
    const input = ecs.getResource<InputResource>("InputResource");
    if (!input) return;

    // Query all player-controlled entities
    const players = ecs.query("PlayerControlled", "Velocity");

    for (const player of players) {
      const velocity = ecs.getComponent(player, "Velocity")!;

      // Reset velocity
      velocity.x = 0;
      velocity.y = 0;

      // WASD or Arrow Keys
      if (input.isKeyDown("KeyW") || input.isKeyDown("ArrowUp")) {
        velocity.y = -velocity.speed;
      }
      if (input.isKeyDown("KeyS") || input.isKeyDown("ArrowDown")) {
        velocity.y = velocity.speed;
      }
      if (input.isKeyDown("KeyA") || input.isKeyDown("ArrowLeft")) {
        velocity.x = -velocity.speed;
      }
      if (input.isKeyDown("KeyD") || input.isKeyDown("ArrowRight")) {
        velocity.x = velocity.speed;
      }

      // Normalize diagonal movement
      if (velocity.x !== 0 && velocity.y !== 0) {
        const length = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        velocity.x = (velocity.x / length) * velocity.speed;
        velocity.y = (velocity.y / length) * velocity.speed;
      }
    }

    // Clear frame state for next frame
    input.clearFrameState();
  }
}