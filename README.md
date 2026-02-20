<p align="center">
      <!-- <img src="./assets/images/logo-with-name.png" /> -->
</p>
<h1 align="center">InLife Benefits CMS Website</h1>

## Introduction

This project serves as CMS(Content Management System) for InLife Benefits Main Site.

## Branches

- **MAIN**: Production branch. This branch contains the stable and tested code for production.
- **DEV**: Staging branch. All development work should be done in this branch.
- **DEV-PHASE2**: Staging branch for phase 2. All development work for phase 2 should be done in this branch.

## Libraries and Plugins

### Core Framework
- **Nuxt 4** – Application framework
- **Vue 3** – Frontend framework
- **Vue Router** – Client-side routing

### State Management
- **Pinia** – State management for Vue
- **@pinia/nuxt** – Pinia integration for Nuxt

### HTTP & Utilities
- **Axios** – HTTP requests
- **MomentJS** – Date and time manipulation
- **XLSX** – Excel file import/export

### Forms & Validation
- **Vee-Validate** – Form validation
- **@vee-validate/i18n** – Internationalization for validation messages
- **Yup** – Schema-based form validation

### UI & UX
- **Quill.js** – WYSIWYG rich text editor
- **@vueup/vue-quill** – Vue wrapper for Quill
- **Vue3-Toastify** – Toast notifications
- **VueDraggable** – Drag-and-drop components (SortableJS wrapper)
- **ScrollTo** – Smooth scrolling to elements
- **Click Outside** – Detect clicks outside elements (used for popups/modals)

### Authentication
- **@sidebase/nuxt-auth** – Authentication for Nuxt applications

### Styling
- **Tailwind CSS** – Utility-first CSS framework
- **@nuxtjs/tailwindcss** – Tailwind integration for Nuxt
- **PostCSS** – CSS processing
- **Autoprefixer** – Vendor prefixing for CSS

### Development & Tooling
- **OXC (Parser / Transform / Minify)** – High-performance JS tooling

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- Node v20.0.19 or newer
- PNPM

### Installation

Clone the repository :

```bash
git clone git@github.com:Designblue-Manila/ib-main-cms.git
```

Install dependencies :

```bash
pnpm install
```

Create a copy of the .env.example file and rename it to .env. Update the database configuration and other settings as needed.
Update the API endpoints under the following pages:
 - nuxt.config.ts
 - app/pages/pages/index.vue
 - app/plugins/axios.js

```bash
cp .env.example .env
```

To run the development server, use the following command:

```bash
pnpm dev -o
```
