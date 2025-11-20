// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export const ComponentTypes = {
  Position: "Position" as const,
  Health: "Health" as const,
  PlayerControlled: "PlayerControlled" as const,
}

export type ComponentType = typeof ComponentTypes[keyof typeof ComponentTypes];

export interface ComponentMap {
  Position: Position;
  Health: Health;
  PlayerControlled: PlayerControlled;
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