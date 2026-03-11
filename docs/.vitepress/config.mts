import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
       title: "geeko-meta",
       description: "NodeJS DI & metadata library written in Typescript",
       themeConfig: {
              nav: [
                     { text: "Home", link: "/" },
                     { text: "Docs", link: "/markdown-examples" },
              ],

              sidebar: [
                     {
                            text: "Docs",
                            items: [
                                   {
                                          text: "Markdown",
                                          link: "/markdown-examples",
                                   },
                                   {
                                          text: "API",
                                          link: "/api-examples",
                                   },
                            ],
                     },
              ],

              socialLinks: [
                     {
                            icon: "github",
                            link: "https://github.com/Metwas/geeko-meta",
                     },
              ],
       },
});
