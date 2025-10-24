---
applyTo: '**/*.html'
---
- Use Semantic HTML
Prefer <header>, <main>, <nav>, <section>, <article>, <footer> over generic <div> for structure.
Use proper heading hierarchy (<h1> → <h2> → <h3>).

- Provide Text Alternatives
Add alt text for all meaningful images.
For decorative images or SVGs, use aria-hidden="true".

- Ensure Accessible Names
Buttons and links must have visible text or aria-label.
Icon-only controls require aria-label describing their action.

- Declare Language
Add lang attribute to <html> (e.g., <html lang="en">).

- Keyboard Navigation
All interactive elements must be reachable via Tab.
Avoid tabindex > 0; use natural DOM order.

- Dynamic Content
Use aria-live="polite" for regions that update without page reload.

- Forms
Pair inputs with <label> or aria-labelledby.
Provide clear error messages and instructions.

- Color & Contrast
Do not rely on color alone for meaning.
Maintain WCAG contrast ratio (minimum 4.5:1 for text).

- ARIA Usage
Use ARIA roles only when native HTML cannot provide semantics.
Avoid unnecessary ARIA attributes.