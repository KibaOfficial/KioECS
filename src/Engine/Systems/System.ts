// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ECS } from "../Core/ECS";

export abstract class System {
  abstract update(ecs: ECS, deltaTime: number): void;
}