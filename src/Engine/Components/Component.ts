// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export const ComponentTypes = {
  Position: "Position" as const,
  Health: "Health" as const,
  PlayerControlled: "PlayerControlled" as const,
  Renderable: "Renderable" as const,
  Velocity: "Velocity" as const,
  Collider: "Collider" as const,
  DamageCooldown: "DamageCooldown" as const,
  AI: "AI" as const,
  Projectile: "Projectile" as const,
  ParticleEmitter: "ParticleEmitter" as const,
  Particle: "Particle" as const,
}

export type ComponentType = typeof ComponentTypes[keyof typeof ComponentTypes];

export interface ComponentMap {
  Position: Position;
  Health: Health;
  PlayerControlled: PlayerControlled;
  Renderable: Renderable;
  Velocity: Velocity;
  Collider: Collider;
  DamageCooldown: DamageCooldown;
  AI: AI;
  Projectile: Projectile;
  ParticleEmitter: ParticleEmitter;
  Particle: Particle;
}

export interface Position {
  x: number;
  y: number;
};

export interface Health {
  current: number;
  max: number;
};

export interface PlayerControlled { } // Marker component

export interface Renderable {
  color: string;
  width: number;
  height: number;
  shape?: "rect" | "circle"; // Optional, default to rect
}

export interface Velocity {
  x: number;
  y: number;
  speed: number; // Base movement speed
}

export interface Collider {
  width: number;
  height: number; 
  solid: boolean;
  layer?: string; // "player", "enemy", "projectile", etc.
}

export interface DamageCooldown {
  timer: number;
  duration: number;
}

export interface AI {
  type: "chase" | "wander" | "patrol" | "idle";
  aggroRange: number;
  target?: number; // Target entity ID
  wanderTimer?: number; // For wander behavior
}

export interface Projectile {
  lifetime: number;
  maxLifetime: number;
  damage: number;
  owner: number; // Entity ID that shot the projectile
  fadeOut: boolean;  
}

export interface ParticleEmitter {
  spawnRate: number; // particles per second
  spawnTimer: number; // time until next spawn
  particleLifetime: number;
  particleColor: string;
  emitting: boolean;
}

export interface Particle {
  lifetime: number;
  maxLifetime: number;
  alpha: number; // opacity for fade out
}