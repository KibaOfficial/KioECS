// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export class InputResource {
  keys: Record<string, boolean> = {}; // Changed to public for easy access
  mouseX: number = 0;
  mouseY: number = 0;
  mouseDown: boolean = false;
  private keysPressed: Set<string> = new Set();
  private keysReleased: Set<string> = new Set();

  constructor() {
    this.setupListeners();
  }

  private setupListeners(): void {
    window.addEventListener("keydown", (e) => {
      if (!this.keys[e.code]) {
        this.keysPressed.add(e.code);
      }
      this.keys[e.code] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
      this.keysReleased.add(e.code);
    });

    // Mouse move listener (relative to canvas)
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
      });

      canvas.addEventListener("mousedown", () => {
        this.mouseDown = true;
      });

      canvas.addEventListener("mouseup", () => {
        this.mouseDown = false;
      });
    }
  }

  isKeyDown(key: string): boolean {
    return this.keys[key] || false;
  }

  isKeyPressed(key: string): boolean {
    return this.keysPressed.has(key);
  }

  isKeyReleased(key: string): boolean {
    return this.keysReleased.has(key);
  }

  // Call this at the end of each frame to clear pressed/released
  clearFrameState(): void {
    this.keysPressed.clear();
    this.keysReleased.clear();
  }
}
