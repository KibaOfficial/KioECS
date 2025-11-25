// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ECS } from "../../Engine/Core/ECS";
import { System } from "../../Engine/Systems/System";
import { AudioResource } from "../../Engine/Resources/AudioResource";
import { InputResource } from "../../Engine/Resources/InputResource";
import { logger } from "../../shared/logger";

export class ShootingSystem extends System {
  private shootCooldown = 0;
  private readonly cooldownDuration = 0.3; // Seconds between shots

  update(ecs: ECS, deltaTime: number): void {
    // Update cooldown
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime;
    }

    const input = ecs.getResource<InputResource>("InputResource");
    if (!input) return;

    // Find player
    const players = ecs.query("PlayerControlled", "Position");
    if (players.length === 0) return;

    const player = players[0];
    const playerPos = ecs.getComponent(player, "Position")!;

    // Check for shoot input (Space key)
    if (input.keys["Space"] && this.shootCooldown <= 0) {
      this.shootProjectile(ecs, player, playerPos);
      this.shootCooldown = this.cooldownDuration;
      
      // Play shoot sound
      const audio = ecs.getResource<AudioResource>("AudioResource");
      if (audio) audio.playSound("shoot", 0.3);
    }
  }

  private shootProjectile(
    ecs: ECS,
    owner: number,
    position: { x: number; y: number }
  ): void {
    const input = ecs.getResource<InputResource>("InputResource");
    if (!input) return;

    // Calculate direction based on mouse position
    const dx = input.mouseX - (position.x + 25); // +25 to center on player (50x50)
    const dy = input.mouseY - (position.y + 25);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return; // Don't shoot if mouse is exactly on player

    // Normalize direction
    const dirX = dx / distance;
    const dirY = dy / distance;

    // Projectile speed
    const speed = 400;

    // Create projectile entity
    const projectile = ecs.createEntity();

    // Spawn slightly in front of player
    const spawnOffset = 30;
    const startX = position.x + 25 + dirX * spawnOffset;
    const startY = position.y + 25 + dirY * spawnOffset;

    ecs.addComponent(projectile, "Position", { x: startX, y: startY });
    ecs.addComponent(projectile, "Velocity", {
      x: dirX * speed,
      y: dirY * speed,
      speed,
    });
    ecs.addComponent(projectile, "Projectile", {
      lifetime: 0,
      maxLifetime: 3.0, // 3 seconds max
      damage: 25,
      owner,
      fadeOut: true,
    });
    ecs.addComponent(projectile, "Renderable", {
      color: "#fbbf24", // Yellow
      width: 8,
      height: 8,
      shape: "circle",
    });
    ecs.addComponent(projectile, "Collider", {
      width: 8,
      height: 8,
      solid: false,
      layer: "projectile",
    });

    // Add particle trail to projectile
    ecs.addComponent(projectile, "ParticleEmitter", {
      spawnRate: 15,
      spawnTimer: 0,
      particleLifetime: 0.4,
      particleColor: "#fbbf24",
      emitting: true,
    });

    // Spawn muzzle flash burst
    this.spawnMuzzleFlash(ecs, startX, startY);

    logger("debug", `Player shot projectile in direction (${dirX.toFixed(2)}, ${dirY.toFixed(2)})`);
  }

  private spawnMuzzleFlash(ecs: ECS, x: number, y: number): void {
    const muzzle = ecs.createEntity();
    ecs.addComponent(muzzle, "Position", { x, y });
    ecs.addComponent(muzzle, "ParticleEmitter", {
      spawnRate: 100, // Burst!
      spawnTimer: 0,
      particleLifetime: 0.2, // Short flash
      particleColor: "#fbbf24",
      emitting: true,
    });

    // Auto-destroy after brief burst
    setTimeout(() => {
      const emitter = ecs.getComponent(muzzle, "ParticleEmitter");
      if (emitter) emitter.emitting = false;
      ecs.destroyEntity(muzzle);
    }, 50); // 50ms burst
  }
}
