// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { logger } from "../../utils/utils";
import { ECS } from "../Core/ECS";
import { RenderResource } from "../Resources/RenderResource";
import { System } from "./System";

export class WorldRenderSystem extends System {
  update(ecs: ECS, deltaTime: number): void {
    const render = ecs.getResource<RenderResource>("RenderResource");

    if (!render) {
      logger("error", "RenderResource not found in ECS resources");
      throw new Error("RenderResource not found in ECS resources");
    }

    // Clear background
    render.clear();
    render.ctx.fillStyle = "#0f172a";
    render.ctx.fillRect(0, 0, render.width, render.height);

    // Render all entities with Position and Renderable components
    const entities = ecs.query("Position", "Renderable");

    for (const entity of entities) {
      const pos = ecs.getComponent(entity, "Position")!;
      const renderable = ecs.getComponent(entity, "Renderable")!;

      render.ctx.fillStyle = renderable.color;

      if (renderable.shape === "circle") {
        render.ctx.beginPath();
        render.ctx.arc(
          pos.x + renderable.width / 2,
          pos.y + renderable.height / 2,
          renderable.width / 2,
          0,
          Math.PI * 2
        );
        render.ctx.fill();
      } else {
        render.ctx.fillRect(pos.x, pos.y, renderable.width, renderable.height);
      }
    }
  }
}