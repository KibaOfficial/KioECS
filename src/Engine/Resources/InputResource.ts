// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export class InputResource {
  private keys: Set<string> = new Set();
  private keysPressed: Set<string> = new Set();
  private keysReleased: Set<string> = new Set();

  constructor() {
    this.setupListeners();
  }

  private setupListeners(): void {
    window.addEventListener("keydown", (e) => {
      if (!this.keys.has(e.code)) {
        this.keysPressed.add(e.code);
      }
      this.keys.add(e.code);
    });

    window.addEventListener("keyup", (e) => {
      this.keys.delete(e.code);
      this.keysReleased.add(e.code);
    });
  }

  isKeyDown(key: string): boolean {
    return this.keys.has(key);
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

  getKeys(): Set<string> {
    return this.keys;
  }
}
