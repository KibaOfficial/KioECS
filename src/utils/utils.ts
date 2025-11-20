// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function logger(type: 'info' | 'warn' | 'error', message: string): void {
  // Message should be prefixed with [KioECS] Time Type and Message
  const time = new Date().toISOString();
  console.log(`[KioECS] [${time}] [${type.toUpperCase()}] ${message}`);
}