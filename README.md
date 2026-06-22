# mdslide

`mdslide` is a modular, high-performance monorepo compiler and presentation tool that converts Markdown documents into gorgeous interactive slide decks in HTML, PDF, or editable/screenshot PPTX formats.

---

## 📦 Project Structure

The project is structured as a monorepo containing the following workspaces under the `packages/` directory:

- **[`@mindfiredigital/mdslide-cli` (packages/cli)](/mdslide/packages/cli)**: Command line interface for compiling, watching, linting, and interactive wizard generation.
- **[`@mindfiredigital/mdslide-core` (packages/core)](/mdslide/packages/core)**: The core compilation engine, slide normalizer, overflow splitted parser, and HTML/PDF/PPTX output renderers.
- **[`@mindfiredigital/mdslide-parser` (packages/parser)](/mdslide/packages/parser)**: Standalone markdown parser producing MDAST JSON format, exposing programmatic defaults (with position coordinates cleaning option) and a standalone CLI.
- **[`@mindfiredigital/mdslide-shared` (packages/shared)](/mdslide/packages/shared)**: Shared common utility functions, helpers, and TypeScript types.

---

## 🛠 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.x or higher) installed on your system.

### Installation

Clone the repository and install dependencies at the root:

```bash
bun install
```

### Local Development Commands

Run the following scripts from the root directory:

- **Build all packages**:
  ```bash
  bun run build
  ```
- **Start development / watch mode**:
  ```bash
  bun run dev
  ```
- **Format codebase**:
  ```bash
  bun run format
  ```
- **Lint codebase**:
  ```bash
  bun run lint
  ```
- **Run tests**:
  ```bash
  bun run test
  ```
- **Run test coverage**:
  ```bash
  bun run test:coverage
  ```

---

## 🚀 Using the CLI (Quick Start)

To install and use `mdslide` globally:

```bash
npm install -g @mindfiredigital/mdslide-cli
# or
bun add -g @mindfiredigital/mdslide-cli
```

### Core Commands

- **Interactive Prompt Wizard**: Run a guided walkthrough to choose options.
  ```bash
  mdslide slides.md
  ```
- **Compile Presentations**: Build standard output formats.
  ```bash
  mdslide compile slides.md --theme gradient --open
  ```
- **Hot-Reload Live Server**: Start a dev server that refreshes your browser automatically on save.
  ```bash
  mdslide watch slides.md --port 3500 --open
  ```
- **Initialize Templates**: Scaffold a sample presentation and configuration file in your directory.
  ```bash
  mdslide init
  ```
- **Validate & Lint Layouts**: Scan your presentation for warnings or slide content overflows.
  ```bash
  mdslide validate slides.md
  ```

---

## ✍️ Presentation Syntax & Authoring Guide

`mdslide` compiles standard Markdown files. You control structure using YAML frontmatter, slide dividers (`---`), and layout comment annotations.

### 1. Global Document Configurations (YAML Frontmatter)

Declare document metadata at the very top of your file between `---` bounds:

```yaml
---
title: My Executive Presentation
theme: gradient # light | dark | notion | terminal | gradient | corporate | solarized
titleAlign: center # Default title alignment across all slides: left | center | right
titlePosition: top # Default title vertical position: top | center | bottom
---
```

### 2. Slide Separation

- Slides are separated by thematic breaks (`---`) on empty lines.
- Alternatively, if no `---` breaks are present, the compiler automatically splits slides at each Level-2 Heading (`##`).

### 3. Slide-Level Customizations & Comments

You can override layouts, alignments, backgrounds, and notes on a per-slide basis using annotations:

#### **Layout Overrides**

Force layout styling for a specific slide:

- `<!-- layout: title -->` — Main presentation cover layout.
- `<!-- layout: bullets -->` — Enhances text lists and bumps font sizing.
- `<!-- layout: code -->` — Optimizes rendering for full-screen code blocks.
- `<!-- layout: visual -->` — Fits images prominently within slide boundaries.
- `<!-- layout: quote -->` — Places quotes inside a styled highlighted card box.
- `<!-- layout: table -->` — Centers comparison grids.
- `<!-- layout: statement -->` — Displays single main highlights in a massive font.
- `<!-- layout: split -->` — Standardizes two-column content layouts.

#### **Slide Title Positioning & Alignment**

- `<!-- titleAlign: center -->` — Align title text for this slide (`left`, `center`, or `right`).
- `<!-- titlePosition: bottom -->` — Vertically position this slide's title (`top`, `center`, or `bottom`).

#### **Background Images**

Set a slide background image using:

```markdown
<!-- backgroundImage: url('https://example.com/slide-bg.jpg') -->
```

- **Luminance Detection**: `mdslide` automatically analyzes the background image on load. If the image is dark, it inverts slide text to white; if light, it uses dark text with drop-shadows.
- **Manual Override**: Append `dark` or `light` to the URL inside the comment to force text theme:
  ```markdown
  <!-- backgroundImage: url('bg.jpg') dark -->
  ```

#### **Presenter Speaker Notes**

Add speaker notes that sync automatically to the Presenter View pop-up window:

```markdown
<!-- notes -->

This text will be hidden on the presentation view but visible to the speaker.

<!-- /notes -->
```

### 4. Two-Column Layouts (`::split::`)

You can split any slide into two columns (text on left, content on right) manually by using the `::split::` separator:

```markdown
# Product Features Comparison

Left Column Header

- High scalability
- Easy installation
- Modular design

::split::

Right Column Header

- 24/7 technical support
- Extended warranty options
- Comprehensive API docs
```

- **Auto-Split**: If a slide contains exactly one image alongside text, `mdslide` automatically converts the layout into a split view, placing text on the left and the image on the right.

---

## Contributing

We welcome contributions from the community. Please follow our [Contributing Guidelines](CONTRIBUTING.md).

## License

Copyright (c) Mindfire Digital LLP. All rights reserved.

Licensed under the MIT license.
