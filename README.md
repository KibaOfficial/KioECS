# 🎮 KioECS

A lightweight, type-safe Entity Component System (ECS) framework built with TypeScript for web-based game development.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### Core Architecture
- 🚀 **Pure ECS Architecture** - Clean separation of Entities, Components, and Systems
- 🔒 **Type-Safe** - Full TypeScript support with autocomplete for Components
- ⚡ **Performant** - Efficient component storage and query system
- 🎯 **Engine/Game Separation** - Reusable engine framework with game-specific logic
- 🧩 **Resource System** - Centralized resource management (Input, Rendering, etc.)

### Built-in Systems
- 🎨 **Rendering** - Canvas-based WorldRenderSystem and UIRenderSystem
- 🎮 **Input** - Keyboard input with WASD/Arrow key support
- 💥 **Collision** - AABB collision detection with damage cooldowns
- ❤️ **Health** - Entity lifecycle management with death/destruction
- 🤖 **AI** - Chase behavior for enemies with configurable aggro range
- 🏃 **Movement** - Physics-based movement with velocity and speed

### Developer Experience
- 🔍 **Debug Overlay** - Real-time FPS, velocity, position, and entity count
- 📊 **Logging System** - Configurable log levels (debug, info, warn, error)
- 🔄 **Hot Reload** - Fast development with Vite
- 🎯 **Clean API** - Intuitive and developer-friendly

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/KibaOfficial/KioECS.git
cd KioECS

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🚀 Quick Start

```typescript
import { GameSetup } from './Game/GameSetup';

// Create your game
const game = new GameSetup("My Awesome Game", "1.0.0", "YourName");

// Initialize and start
await game.initialize();
game.start();
```

### Demo Game Features
The included demo showcases:
- **Player Movement** - WASD/Arrow keys (200 px/s)
- **Enemy AI** - 5 enemies that chase player within 300px range
- **Collision System** - AABB collision with damage cooldown (1s)
- **Health System** - Health regeneration and entity destruction on death
- **Debug Overlay** - Set log level to `debug` to show FPS, velocity, position, and entity count

### Controls
- **WASD** or **Arrow Keys** - Move player
- **Escape** - (Future: Pause menu)

## 🏗️ Architecture

KioECS follows a clean **Engine/Game separation** pattern:

```
src/
├── Engine/              # Reusable framework
│   ├── Core/
│   │   ├── ECS.ts      # Pure ECS implementation
│   │   └── Engine.ts   # Engine orchestration
│   ├── Components/     # Generic components
│   ├── Systems/        # Generic systems (Input, Render, etc.)
│   └── Resources/      # Shared resources (Input, Canvas)
│
└── Game/               # Your game-specific code
    ├── GameSetup.ts   # Game initialization
    ├── Systems/       # Game-specific systems (AI, etc.)
    └── Components/    # Game-specific components
```

### Layers

**Engine Layer** (Reusable)
- ECS Core - Entity/Component/System management
- Generic Systems - Input, Movement, Rendering, Collision
- Resources - InputResource, RenderResource
- **Can be used for any game!**

**Game Layer** (Game-Specific)
- GameSetup - Initializes your specific game
- Custom Systems - EnemyAISystem, etc.
- Entity Creation - Player, Enemies, Items
- **Your game logic lives here!**

```
┌─────────────────────────────────────┐
│       Game Layer (Specific)         │
│  - GameSetup                        │
│  - EnemyAISystem                    │
│  - Create Player/Enemies            │
└─────────────────────────────────────┘
            │ uses
┌─────────────────────────────────────┐
│      Engine Layer (Generic)         │
│  - ECS Core                         │
│  - InputSystem, MovementSystem      │
│  - WorldRenderSystem                │
└─────────────────────────────────────┘
```

### ECS Pattern

```
┌─────────────────────────────────────┐
│  Entity (ID: number)                │  Pure identifier
└─────────────────────────────────────┘
            │
            ├── Component: Position { x, y }
            ├── Component: Health { current, max }
            └── Component: Velocity { dx, dy }

┌─────────────────────────────────────┐
│  System                             │  Pure logic
│  - Queries entities with components │
│  - Processes game logic             │
└─────────────────────────────────────┘
```

### Core Concepts

#### **Entity** = Just an ID
```typescript
const player = ecs.createEntity(); // Returns: 0 (just a number!)
```

#### **Component** = Pure Data
```typescript
interface Position {
  x: number;
  y: number;
}

interface Health {
  current: number;
  max: number;
}
```

#### **System** = Pure Logic
```typescript
class HealthSystem extends System {
  update(ecs: ECS, deltaTime: number): void {
    const entities = ecs.query("Health");
    
    for (const entity of entities) {
      const health = ecs.getComponent(entity, "Health")!;
      
      if (health.current <= 0) {
        console.log(`Entity ${entity} died!`);
      }
    }
  }
}
```

## 📚 Examples

### Creating Entities with Components

```typescript
// Create a player entity
const player = ecs.createEntity();
ecs.addComponent(player, "Position", { x: 100, y: 100 });
ecs.addComponent(player, "Health", { current: 100, max: 100 });
ecs.addComponent(player, "PlayerControlled", {});

// Create an enemy entity
const enemy = ecs.createEntity();
ecs.addComponent(enemy, "Position", { x: 200, y: 200 });
ecs.addComponent(enemy, "Health", { current: 50, max: 50 });
ecs.addComponent(enemy, "Velocity", { dx: 10, dy: 0 });
```

### Querying Entities

```typescript
// Get all entities with Health
const livingEntities = ecs.query("Health");

// Get all entities with Position AND Velocity
const movingEntities = ecs.query("Position", "Velocity");

// Get all player-controlled entities
const players = ecs.query("PlayerControlled");
```

### Creating Custom Systems

```typescript
import { System } from './Systems/System';
import { ECS } from './Core/ECS';

export class MovementSystem extends System {
  update(ecs: ECS, deltaTime: number): void {
    // Query all entities that have both Position and Velocity
    const entities = ecs.query("Position", "Velocity");
    
    for (const entity of entities) {
      const pos = ecs.getComponent(entity, "Position")!;
      const vel = ecs.getComponent(entity, "Velocity")!;
      
      // Update position based on velocity
      pos.x += vel.dx * deltaTime;
      pos.y += vel.dy * deltaTime;
    }
  }
}
```

### Adding Custom Components

```typescript
// 1. Define the component interface in Components/Component.ts
export interface Sprite {
  image: HTMLImageElement;
  width: number;
  height: number;
}

// 2. Add to ComponentTypes
export const ComponentTypes = {
  Position: "Position" as const,
  Health: "Health" as const,
  Sprite: "Sprite" as const, // ← Add here
}

// 3. Add to ComponentMap
export interface ComponentMap {
  Position: Position;
  Health: Health;
  Sprite: Sprite; // ← Add here
}

// 4. Use it with full type safety!
ecs.addComponent(entity, "Sprite", {
  image: myImage,
  width: 32,
  height: 32
});
```

## 🎯 Project Structure

```
KioECS/
├── src/
│   ├── Core/
│   │   ├── ECS.ts           # Core ECS implementation
│   │   └── Engine.ts        # Game engine orchestration
│   ├── Components/
│   │   └── Component.ts     # Component definitions
│   ├── Entities/
│   │   └── Entity.ts        # Entity type definition
│   ├── Systems/
│   │   ├── System.ts        # Abstract System base class
│   │   └── HealthSystem.ts  # Example system
│   ├── utils/
│   │   └── utils.ts         # Utility functions
│   └── index.ts             # Entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔧 API Reference

### ECS Core

#### `createEntity(): Entity`
Creates a new entity and returns its ID.

#### `addComponent<K>(entity: Entity, type: K, data: ComponentMap[K]): void`
Adds a component to an entity with type-safe data.

#### `getComponent<K>(entity: Entity, type: K): ComponentMap[K] | undefined`
Retrieves a component from an entity.

#### `removeComponent<K>(entity: Entity, type: K): void`
Removes a component from an entity.

#### `hasComponent<K>(entity: Entity, type: K): boolean`
Checks if an entity has a specific component.

#### `query<K>(...componentTypes: K[]): Entity[]`
Returns all entities that have ALL specified components.

#### `destroyEntity(entity: Entity): void`
Removes an entity and all its components.

#### `addSystem(system: System): void`
Adds a system to the ECS.

#### `update(deltaTime: number): void`
Updates all systems. Called automatically by the game loop.

### Engine

#### `initialize(): Promise<void>`
Initializes the engine, sets up systems, and creates initial entities.

#### `start(): void`
Starts the game loop.

#### `stop(): void`
Stops the game loop.

#### `getECS(): ECS`
Returns the ECS instance for direct access.

## 🎨 Built-in Systems

### HealthSystem
Manages entity health, handles regeneration, and detects death.

```typescript
// Automatically regenerates health over time
// Logs when entities die (health <= 0)
```

## 🔮 Roadmap

- [ ] Render System (Canvas/WebGL)
- [ ] Input System
- [ ] Collision System
- [ ] Audio System
- [ ] Scene Manager
- [ ] Physics System
- [ ] Particle System
- [ ] Asset Loader
- [ ] Serialization/Deserialization
- [ ] Performance profiler
- [ ] Networking/Multiplayer
- [ ] Sound System

## 📚 Built-in Components

| Component | Properties | Description |
|-----------|-----------|-------------|
| `Position` | `x`, `y` | Entity position in world space |
| `Velocity` | `x`, `y`, `speed` | Movement velocity and base speed |
| `Health` | `current`, `max` | Entity health points |
| `Renderable` | `color`, `width`, `height`, `shape` | Visual representation |
| `Collider` | `width`, `height`, `solid`, `layer` | Collision bounds |
| `PlayerControlled` | - | Marker for player entity |
| `AI` | `type`, `aggroRange`, `target` | AI behavior configuration |
| `DamageCooldown` | `timer`, `duration` | Prevents continuous damage |

## 🔧 Built-in Systems

| System | Purpose | Execution Order |
|--------|---------|----------------|
| `InputSystem` | Keyboard input handling | 1 (First) |
| `EnemyAISystem` | AI behavior logic | 2 |
| `MovementSystem` | Apply velocity to position | 3 |
| `CollisionSystem` | Collision detection & response | 4 |
| `HealthSystem` | Health regeneration & death | 5 |
| `WorldRenderSystem` | Render game entities | 6 |
| `UIRenderSystem` | Render UI/HUD | 7 (Last) |

## 🎯 API Quick Reference

```typescript
// Entity Management
const entity = engine.createEntity();
engine.destroyEntity(entity);

// Component Management
engine.addComponent(entity, "Position", { x: 100, y: 200 });
const pos = engine.getComponent(entity, "Position");
const hasPos = engine.hasComponent(entity, "Position");

// Queries
const movingEntities = engine.query("Position", "Velocity");

// Resources
engine.addResource("MyResource", myResourceInstance);
const resource = engine.getResource<MyResourceType>("MyResource");

// System Registration
engine.registerSystem(new MyCustomSystem());

// Engine Control
await engine.initialize();
engine.start();
engine.stop();

// Logging
import { setLogLevel } from './utils/utils';
setLogLevel('debug'); // 'debug' | 'info' | 'warn' | 'error'
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**KibaOfficial**
- Website: [kibaofficial.vercel.app](https://kibaofficial.vercel.app)
- GitHub: [@KibaOfficial](https://github.com/KibaOfficial)

## 🙏 Acknowledgments

- Inspired by modern ECS implementations like Unity DOTS and Bevy
- Built with TypeScript and Vite
- Special thanks to the ECS community

## 💡 Learn More

- [Understanding ECS](https://github.com/SanderMertens/ecs-faq)
- [ECS Best Practices](https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/understanding-component-entity-systems-r3013/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**Made with ❤️ by KibaOfficial**