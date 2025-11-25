// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ECS } from "../Core/ECS";
import { AudioResource } from "../Resources/AudioResource";
import { System } from "./System";
import { logger } from "../../shared/logger";

export class ProjectileSystem extends System {
  update(ecs: ECS, deltaTime: number): void {
    const projectiles = ecs.query("Projectile", "Position", "Velocity");
    const toDestroy: number[] = [];

    for (const projectile of projectiles) {
      const proj = ecs.getComponent(projectile, "Projectile");

      if (!proj) continue;

      // Update lifetime
      proj.lifetime += deltaTime;

      // Check for collision with enemies
      this.checkProjectileCollisions(ecs, projectile);

      // Destroy if lifetime exceeded
      if (proj.lifetime >= proj.maxLifetime) {
        toDestroy.push(projectile);
      }
    }

    // Destroy expired projectiles (and stop their particle emitters)
    for (const entity of toDestroy) {
      const emitter = ecs.getComponent(entity, "ParticleEmitter");
      if (emitter) emitter.emitting = false;
      ecs.destroyEntity(entity);
    }
  }

  private checkProjectileCollisions(ecs: ECS, projectile: number): void {
    const projPos = ecs.getComponent(projectile, "Position");
    const projCol = ecs.getComponent(projectile, "Collider");
    const projComp = ecs.getComponent(projectile, "Projectile");

    if (!projPos || !projCol || !projComp) return;

    // Check collision with enemies (entities with AI component)
    const enemies = ecs.query("AI", "Position", "Collider", "Health");

    for (const enemy of enemies) {
      // Don't hit the owner
      if (enemy === projComp.owner) continue;

      const enemyPos = ecs.getComponent(enemy, "Position")!;
      const enemyCol = ecs.getComponent(enemy, "Collider")!;
      const enemyHealth = ecs.getComponent(enemy, "Health")!;

      // Simple AABB collision
      if (this.checkAABB(projPos, projCol, enemyPos, enemyCol)) {
        // Deal damage
        enemyHealth.current -= projComp.damage;
        logger("info", `Projectile hit enemy ${enemy}! Damage: ${projComp.damage}`);

        // Play hit sound
        const audio = ecs.getResource<AudioResource>("AudioResource");
        if (audio) audio.playSound("hit", 0.5);

        // Spawn impact particles
        this.spawnImpactParticles(ecs, projPos.x, projPos.y);

        // Stop projectile's particle emitter before destroying
        const projEmitter = ecs.getComponent(projectile, "ParticleEmitter");
        if (projEmitter) projEmitter.emitting = false;

        // Destroy projectile
        ecs.destroyEntity(projectile);
        return;
      }
    }
  }

  private spawnImpactParticles(ecs: ECS, x: number, y: number): void {
    const impact = ecs.createEntity();
    ecs.addComponent(impact, "Position", { x, y });
    ecs.addComponent(impact, "ParticleEmitter", {
      spawnRate: 50,
      spawnTimer: 0,
      particleLifetime: 0.4,
      particleColor: "#ef4444", // Red blood splatter
      emitting: true,
    });

    // Auto-destroy after burst
    setTimeout(() => {
      const emitter = ecs.getComponent(impact, "ParticleEmitter");
      if (emitter) emitter.emitting = false;
      ecs.destroyEntity(impact);
    }, 100); // 100ms burst
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
}
