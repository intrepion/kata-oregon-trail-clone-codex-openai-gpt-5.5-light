# Static Direct-File Delivery

The game will be designed for both a normal local development server and a packaged static build that runs from `file://` by double-clicking `index.html`. This constrains asset loading and bundling early, but it preserves the user's expected clone-review workflow and prevents browser-only regressions where the game works through Vite while the shipped artifact fails from disk.
