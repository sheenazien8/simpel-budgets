const mix = require("laravel-mix");
const path = require("path");

mix
  .ts("resources/js/app.js", "public/js")
  /* .alias({
    "@": path.resolve("./resources/js/"),
  }) */
  .postCss("resources/css/app.css", "public/css", [
    //
  ]);
