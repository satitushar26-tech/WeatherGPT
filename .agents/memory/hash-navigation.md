---
name: SPA hash navigation
description: Behavior to preserve when linking from navigation to an in-page section in the WeatherGPT SPA.
---

Hash links handled by the client router do not reliably trigger the browser's native fragment scroll. In-page navigation should explicitly find the target and call smooth scrolling, including after navigating to the home route from another page.

**Why:** The Ask WeatherGPT navigation item appeared inert when the assistant was already on the page because the router changed history without performing fragment scrolling.

**How to apply:** For future in-page navigation, prevent the router link's default behavior when needed, navigate to the target route, then scroll to the section after the route renders.