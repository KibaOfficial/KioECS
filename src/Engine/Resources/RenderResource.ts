// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { logger } from "../../utils/utils";

export class RenderResource {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public width: number;
  public height: number;
  private container: HTMLElement;

  constructor(containerSelector: string) {
    const container = document.querySelector<HTMLDivElement>(containerSelector);
    if (!container) {
      logger("error", `Container element not found: ${containerSelector}`);
      throw new Error("Container element not found");
    }

    this.container = container;
    this.canvas = document.createElement("canvas");
    this.canvas.id = "game-canvas";
    container.appendChild(this.canvas);

    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      logger("error", "Failed to get 2D context from canvas");
      throw new Error("Failed to get 2D context");
    }

    this.ctx = ctx;

    // Initialize size
    this.width = container.clientWidth;
    this.height = container.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Handle window resize
    window.addEventListener("resize", () => this.handleResize());
    logger("info", `Canvas initialized: ${this.width}x${this.height}`);
  }

  private handleResize(): void {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    logger("info", `Canvas resized: ${this.width}x${this.height}`);
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
