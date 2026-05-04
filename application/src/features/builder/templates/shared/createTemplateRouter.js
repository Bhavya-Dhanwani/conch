import TemplateSite from "./TemplateSite";
import { createBrowserRouter } from "react-router";

function routePath(path) {
  return path === "/" ? "/" : path.replace(/^\//, "");
}

export function createTemplateRouter(template) {
  return createBrowserRouter(
    template.pages.map((page) => ({
      path: routePath(page.path),
      element: <TemplateSite template={template} initialPage={page.id} />,
      loader: () => ({ templateSlug: template.slug, pageId: page.id }),
    })),
  );
}

export function createTemplateRouters(templates) {
  return templates.reduce((routers, template) => {
    routers[template.slug] = createTemplateRouter(template);
    return routers;
  }, {});
}
