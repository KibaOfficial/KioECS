// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ECS } from "../Core/ECS";
import { System } from "./System";

export class ParticleSystem extends System {
  update(ecs: ECS, deltaTime: number): void {
    this.updateEmitters(ecs, deltaTime);
    this.updateParticles(ecs, deltaTime);
  }

  private updateEmitters(ecs: ECS, deltaTime: number): void {
    const emitters = ecs.query("ParticleEmitter", "Position");

    for (const emitter of emitters) {
      const emitterComp = ecs.getComponent(emitter, "ParticleEmitter");
      const position = ecs.getComponent(emitter, "Position");

      if (!emitterComp || !position || !emitterComp.emitting) continue;

      // Update spawn timer
      emitterComp.spawnTimer -= deltaTime;

      // Spawn particles
      while (emitterComp.spawnTimer <= 0 && emitterComp.emitting) {
        this.spawnParticle(ecs, position.x, position.y, emitterComp);
        emitterComp.spawnTimer += 1 / emitterComp.spawnRate;
      }
    }
  }

  private spawnParticle(
    ecs: ECS,
    x: number,
    y: number,
    emitter: { particleLifetime: number; particleColor: string }
  ): void {
    const particle = ecs.createEntity();

    // Random velocity for particle spread
    const angle = Math.random() * Math.PI * 2;
    const speed = 20 + Math.random() * 30;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    // Random offset from emitter position
    const offsetX = (Math.random() - 0.5) * 10;
    const offsetY = (Math.random() - 0.5) * 10;

    ecs.addComponent(particle, "Position", { x: x + offsetX, y: y + offsetY });
    ecs.addComponent(particle, "Velocity", { x: vx, y: vy, speed });
    ecs.addComponent(particle, "Particle", {
      lifetime: 0,
      maxLifetime: emitter.particleLifetime,
      alpha: 1.0,
    });
    ecs.addComponent(particle, "Renderable", {
      color: emitter.particleColor,
      width: 3,
      height: 3,
      shape: "circle",
    });
  }

  private updateParticles(ecs: ECS, deltaTime: number): void {
    const particles = ecs.query("Particle");
    const toDestroy: number[] = [];

    for (const entity of particles) {
      const particle = ecs.getComponent(entity, "Particle");
      if (!particle) continue;

      // Update lifetime
      particle.lifetime += deltaTime;

      // Calculate fade out
      const lifeRatio = particle.lifetime / particle.maxLifetime;
      particle.alpha = Math.max(0, 1 - lifeRatio);

      // Mark for destruction if lifetime exceeded
      if (particle.lifetime >= particle.maxLifetime) {
        toDestroy.push(entity);
      }
    }

    // Destroy expired particles
    for (const entity of toDestroy) {
      ecs.destroyEntity(entity);
    }
  }
}
