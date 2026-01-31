# Surgent Web Template

A modern React template for building web applications with Surgent AI App Builder.

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Bun |
| Framework | React 19 + Vite 7 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 (OKLCH color system) |
| State | Zustand + React Query |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| UI Primitives | Radix UI (53 pre-built components) |
| Types | TypeScript 5.9 (strict mode) |
| Backend | Convex (optional) |

## Project Structure

```
src/
├── components/
│   ├── ui/           # 53 shadcn-style components (Button, Dialog, etc.)
│   └── error/        # Error boundary + fallback UI
├── hooks/            # Custom hooks (e.g., useIsMobile)
├── lib/              # Utilities (cn, errorReporter)
├── pages/            # Route components
├── index.css         # Global styles + Tailwind config
└── main.tsx          # Entry point
```

## Scripts

```bash
bun dev          # Start Vite dev server
bun build        # Production build
bun typecheck    # TypeScript type checking
bun dev:convex   # Dev server with Convex backend sync
```

## Key Patterns

### Path Alias
Use `@/` to import from src:
```tsx
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

### Styling with Tailwind
Use the `cn()` utility for conditional classes:
```tsx
import { cn } from '@/lib/utils'

<div className={cn('base-class', isActive && 'active-class')} />
```

### Component Naming
- Use **kebab-case** for file names: `user-profile.tsx`
- Use **PascalCase** for component names: `UserProfile`

### Error Handling
3-tier error system:
1. **Global** - `window.onerror` catches runtime errors
2. **React Boundary** - `ErrorBoundary` catches component errors
3. **Route Boundary** - `RouteErrorBoundary` catches routing errors

Errors are posted to parent window (for Surgent preview integration).

## UI Components

53 pre-built components in `src/components/ui/`:

**Layout**: Card, Dialog, Drawer, Sheet, Tabs, Accordion, Collapsible, Resizable, Scroll Area, Separator

**Forms**: Button, Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider, Calendar, Date Picker, Form, Label

**Feedback**: Alert, Badge, Progress, Skeleton, Spinner, Toast (Sonner)

**Navigation**: Breadcrumb, Dropdown Menu, Context Menu, Menubar, Navigation Menu, Pagination

**Data Display**: Avatar, Table, Carousel, Chart (Recharts), Hover Card, Tooltip

**Overlay**: Alert Dialog, Dialog, Popover, Sheet, Drawer, Command (⌘K)

Metadata for Surgent platform:
```json
{
  "name": "surgent-web-server",
  "scripts": {
    "init": "bun install",
    "dev": "bun run dev",
    "lint": "bun run lint"
  }
}
```

## Important Rules

- **Always use Bun** - never npm, yarn, or pnpm
- **Use kebab-case** for file and folder names
- **Use existing components** from `src/components/ui/` before creating new ones
- **Follow existing patterns** - check similar files for conventions
- **Keep it simple** - avoid over-engineering, build MVPs first
