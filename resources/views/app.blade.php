<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <!-- PWA  -->
    <title>Simpel Budget</title>
    <link rel="icon" type="image/x-icon" href="/images/logo500x500.png">
    <meta name="title" content="Simpel Budget">
    <meta name="keywords" content="Aplikasi pencatatan keuangan sederhana, aplikasi anggaran perbulan yang sederhana"/>
    <meta name="description" content="Simpel budget adalah aplikasi sederhana untuk mencatat keuangan anda, tanpa banyak menu, tanpa banyak tutorial!">
    <meta name=”robots” content="index, follow">
    <meta name="theme-color" content="#6777ef"/>
    <link rel="apple-touch-icon" href="{{ asset('/images/logo500x500.png') }}">
    <link rel="manifest" href="{{ asset('/manifest.json') }}">
    <link href="{{ mix('/css/app.css') }}" rel="stylesheet" />
    @inertiaHead
  </head>
  <body>
      @inertia
  </body>
  <script src="{{ asset('/sw.js') }}"></script>
  <script>
      if (!navigator.serviceWorker.controller) {
          navigator.serviceWorker.register("/sw.js").then(function (reg) {
              console.log("Service worker has been registered for scope: " + reg.scope);
          });
      }
  </script>
  <script src="{{ mix('/js/app.js') }}"></script>
</html>
