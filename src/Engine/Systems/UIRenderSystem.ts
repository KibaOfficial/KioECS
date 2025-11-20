// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ECS } from "../Core/ECS";
import { RenderResource } from "../Resources/RenderResource";
import { System } from "./System";

export class UIRenderSystem extends System {
  private frameCount: number = 0;
  private fps: number = 0;
  private fpsTimer: number = 0;

  update(ecs: ECS, deltaTime: number): void {
    const render = ecs.getResource<RenderResource>("RenderResource");
    if (!render) return;

    const ctx = render.ctx;

    // Calculate FPS
    this.frameCount++;
    this.fpsTimer += deltaTime;
    if (this.fpsTimer >= 1.0) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsTimer = 0;
    }

    const players = ecs.query("PlayerControlled", "Health");
    if (players.length === 0) return;

    const player = players[0];
    const health = ecs.getComponent(player, "Health")!;

    // Health bar background
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(10, 10, 204, 24);

    // Health bar
    ctx.fillStyle = "#ef4444";
    const healthWidth = (health.current / health.max) * 200;
    ctx.fillRect(12, 12, healthWidth, 20);

    // Health text
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px monospace";
    ctx.fillText(`HP: ${Math.round(health.current)}/${health.max}`, 220, 28);

    // Debug info (only in debug mode)
    this.drawDebugInfo(ecs, ctx, render, player);
  }

  private drawDebugInfo(ecs: ECS, ctx: CanvasRenderingContext2D, render: RenderResource, player: number): void {
    // Check if we're in debug mode by trying to access the logger
    // We'll check if debug logs would be shown
    const isDebugMode = this.isDebugEnabled();
    
    if (!isDebugMode) return;

    const velocity = ecs.getComponent(player, "Velocity");
    const position = ecs.getComponent(player, "Position");

    ctx.fillStyle = "#10b981";
    ctx.font = "12px monospace";
    
    let y = 20;
    const x = render.width - 200;

    // FPS
    ctx.fillText(`FPS: ${this.fps}`, x, y);
    y += 18;

    // Delta Time
    ctx.fillText(`Delta: ${(1000 / this.fps).toFixed(1)}ms`, x, y);
    y += 18;

    if (velocity) {
      // Speed
      const currentSpeed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
      ctx.fillText(`Speed: ${currentSpeed.toFixed(0)}px/s`, x, y);
      y += 18;
      
      // Velocity
      ctx.fillText(`Vel: (${velocity.x.toFixed(0)}, ${velocity.y.toFixed(0)})`, x, y);
      y += 18;
    }

    if (position) {
      // Position
      ctx.fillText(`Pos: (${Math.round(position.x)}, ${Math.round(position.y)})`, x, y);
      y += 18;
    }

    // Entity count
    const allEntities = ecs.query("Position");
    ctx.fillText(`Entities: ${allEntities.length}`, x, y);
  }

  private isDebugEnabled(): boolean {
    // Access the logger to check log level
    try {
      // We can't directly access the Logger instance, so we check via a global
      // or we can add a helper function in utils
      // For now, we'll use a simple approach
      return (window as any).__KIOECS_DEBUG__ === true;
    } catch {
      return false;
    }
  }
}
