import React from "react";
import { InertiaApp } from "@inertiajs/inertia-react";
import { createRoot } from "react-dom/client";

const app = document.getElementById("app");

createRoot(app).render(
  <div>
    <InertiaApp
      initialPage={JSON.parse(app.dataset.page)}
      resolveComponent={(name) =>
        import(`./Pages/${name}`).then((module) => module.default)
      }
    />
  </div>,
);

