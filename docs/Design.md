# Title: UI/UX Design System Specification - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Systematize the design decisions, layouts, palette tokens, typography, and states for the Credit Compass frontend interface.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: None
* **Related Documents**: [PRD.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/PRD.md), [TechSpec.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/TechSpec.md)

---

## Table of Contents
1. [Design Principles](#design-principles)
2. [Color Palette (HSL & Hex)](#color-palette-hsl--hex)
3. [Typography Hierarchy](#typography-hierarchy)
4. [Spacing & Grid Systems](#spacing--grid-systems)
5. [Iconography Standards](#iconography-standards)
6. [UI Components Blueprint](#ui-components-blueprint)
   - [Buttons](#buttons)
   - [Cards](#cards)
   - [Dashboard Layout](#dashboard-layout)
   - [Chat Console Interface](#chat-console-interface)
7. [Visual Wireframe & Navigation Flows](#visual-wireframe--navigation-flows)
8. [Responsive Design (Mobile vs. Desktop)](#responsive-design-mobile-vs-desktop)
9. [Accessibility Compliance](#accessibility-compliance)
10. [Transitions & Animations](#transitions--animations)
11. [Dynamic UI States](#dynamic-ui-states)
    - [Loading States](#loading-states)
    - [Error States](#error-states)
    - [Empty States](#empty-states)
12. [Implementation Notes & Guidelines](#implementation-notes--guidelines)

---

## Design Principles
- **Elevated FinTech Dark Theme**: Deep backgrounds coupled with glowing accents to create a premium, high-tech interface.
- **Glassmorphism**: Translucent, blurred backgrounds that imply layer depth (inspired by Apple, Stripe, and CRED).
- **Explainable by Design**: Charts, progress rings, and SHAP cards should focus on clarity and guide users to make positive adjustments.
- **High Interaction Comfort**: Responsive elements, hovering feedback, and transition effects.

---

## Color Palette (HSL & Hex)
We use a premium, custom HSL color palette to ensure cohesive dark mode layouts.

| Token | Hex | HSL Representation | Primary Usage |
|-------|-----|-------------------|---------------|
| **Background (Slate-950)** | `#0b0f19` | `hsl(222, 47%, 5%)` | Primary page container |
| **Surface (Slate-900)** | `#121826` | `hsl(222, 36%, 11%)` | Card borders, translucent bases |
| **Primary Accent (Emerald)** | `#10b981` | `hsl(162, 76%, 41%)` | Credit gains, metrics |
| **Secondary Accent (Cyan)** | `#06b6d4` | `hsl(188, 86%, 43%)` | Chart lines, active statuses |
| **Alert/Warning (Amber)** | `#f59e0b` | `hsl(38, 92%, 50%)` | Moderate credit warnings |
| **Negative Impact (Rose)** | `#f43f5e` | `hsl(343, 90%, 60%)` | Decreased factors, debt indicators |
| **Text Primary** | `#f8fafc` | `hsl(210, 40%, 98%)` | High-contrast copy |
| **Text Secondary** | `#94a3b8` | `hsl(215, 20%, 65%)` | Secondary guides, labels |

---

## Typography Hierarchy
We integrate the **Inter** font family from Google Fonts to maintain clean text lines.

- **Display Title (H1)**: `Inter`, 2.25rem (36px), SemiBold, letter-spacing: `-0.02em`. Used for page titles.
- **Section Heading (H2)**: `Inter`, 1.5rem (24px), Medium. Used for card headers.
- **Card Title (H3)**: `Inter`, 1.125rem (18px), Medium. Used for individual metric titles.
- **Body Text**: `Inter`, 0.875rem (14px), Regular, leading: `1.5`. Used for explanations.
- **Data Callout**: `Inter`, 1.75rem (28px), Bold, monospace-like numbers. Used for credit scores.

---

## Spacing & Grid Systems
- **Base Unit**: `4px` grid system.
- **Paddings & Margins**:
  - Small: `8px` (px-2, py-2)
  - Medium: `16px` (px-4, py-4)
  - Large: `24px` (px-6, py-6)
- **Layout Grid**: 12-column grid configuration. Responsive breakpoints:
  - Mobile: `< 640px` (Single column block stack)
  - Tablet: `640px - 1024px` (Dual-column layout)
  - Desktop: `> 1024px` (Triple-column view dashboard)

---

## Iconography Standards
We standardise on **Lucide React Icons**:
- Credit Assessment: `ShieldAlert`, `CheckCircle2`, `TrendingUp`, `Gauge`
- Investment Wizard: `Bot`, `Sparkles`, `TrendingDown`, `DollarSign`
- Navigation Interface: `LayoutDashboard`, `MessageSquareCode`, `LogOut`, `Settings`

---

## UI Components Blueprint

### Buttons
- **Primary Action (Active)**: Glassmorphic green background (`bg-emerald-500/20 hover:bg-emerald-500/30`), border-emerald-500/40, transition-all duration-300.
- **Secondary Action**: Border-slate-700/50, background hover-slate-800/40.
- **Disabled State**: Text-slate-600, background-slate-900/40, cursor-not-allowed.

### Cards
- Translucent container with border styling:
  ```css
  .glass-card {
    background: rgba(18, 24, 38, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
  }
  ```

### Dashboard Layout
- **Sidebar**: Fixed left panel containing logo, route links, and profile badge.
- **Main Canvas**: Grid layout holding the Credit likelihood dial and SHAP cards.
- **Footer Alert**: Dark amber container highlighting the educational disclaimer.

### Chat Console Interface
- Chat bubble containers:
  - **Advisor (System)**: Translucent surface background with cyan left border accent.
  - **User (Client)**: Deep slate surface right-aligned with green borders.
- Floating input bar containing interactive slider suggestions.

---

## Visual Wireframe & Navigation Flows

```
+--------------------------------------------------------------------------+
|  CREDIT COMPASS  [Dashboard] [Chat Advisor]                     User Profile |
+--------------------------------------------------------------------------+
|  [ Main Dashboard Grid ]                                                 |
|  +---------------------------+  +-------------------------------------+  |
|  |     Your Credit Score     |  |       SHAP Explainability           |  |
|  |           (710)           |  |                                     |  |
|  |       [Gauge Chart]       |  |  [+] High Savings Rate (Strongest)  |  |
|  |     Alternative Index     |  |  [-] Active Debt Load (Weakest)     |  |
|  +---------------------------+  +-------------------------------------+  |
|  +--------------------------------------------------------------------+  |
|  |                        Actionable Advice                           |  |
|  |  * Reduce subscription count by 2. * Pay utilities 3 days earlier.  |  |
|  +--------------------------------------------------------------------+  |
+--------------------------------------------------------------------------+
| [WARNING] This is an educational simulator only. Projections are synthetic.|
+--------------------------------------------------------------------------+
```

---

## Responsive Design (Mobile vs. Desktop)
- **Mobile Adjustments**: Sidebar collapses into a sticky navigation header. Touch targets expand to `48px` minimum size. Charts toggle to single-column blocks to prevent layout overflows.
- **Desktop Adjustments**: Grid scales to multi-column display with hovering animations.

---

## Accessibility Compliance
- **Contrast ratio**: Minimum 4.5:1 ratio for text outputs.
- **Screen Reader Support**: Active ARIA-labels attached to SVG chart structures.
- **Keyboard Access**: Focus outlines configured for custom button classes.

---

## Transitions & Animations
- **Hover Transitions**: `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`.
- **Chart Animation**: Recharts transitions configured with a `750ms` easing loop.
- **Conversation Entry**: Chat bubbles slide up using a subtle fade-in keyframe:
  ```css
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  ```
- **Premium Entrance Animation**: High-compatibility HTML5 Canvas 2D physics transition engine:
  - **Phase 1 (0.0s – 0.8s)**: Smooth fade-in of all elements and needle rotation (settling at 0 rad).
  - **Phase 2 (0.8s – 1.2s)**: Stable resolved state ensuring readable branding.
  - **Phase 2.5 (1.2s – 1.6s)**: Subtle animated noise wobble and edge particle detachment.
  - **Phase 3 (1.6s – 3.6s)**: Organic left-to-right dissolve using Simplex noise, spawning drifting emerald dust and falling cyan/blue petals.
  - **Phase 4 (3.6s – 4.6s)**: Full overlay background fade-out to reveal the login screen.
  - **Reduced Motion Fallback**: Replaces the physics and particles with a simple, elegant 1.5s fade-in/fade-out transition.
  - **Performance Optimization**: Adjusts particle grid sampling density based on device CPU cores and available memory.

---

## Dynamic UI States

### Loading States
- Skeleton cards utilizing a pulsing animation class:
  ```css
  .pulse-skeleton {
    animation: pulse 1.8s infinite ease-in-out;
  }
  ```

### Error States
- Visual alert panels with a warning icon (`AlertTriangle`), a readable explanation of what failed, and a retry button.

### Empty States
- Custom graphics for first-time login views, showing a call-to-action button (e.g., "Run Alternative Credit Assessment").

---

## Implementation Notes & Guidelines
- **Rule 1**: Never use solid borders. All borders must be transparent or translucent (`border-slate-800/60` or `border-white/5`).
- **Rule 2**: The footer disclaimer must render on every page, with fixed position sizing to guarantee immediate visibility during client demos.
