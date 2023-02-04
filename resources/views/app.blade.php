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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,800;1,900&display=swap" rel="stylesheet">
    <link rel="apple-touch-icon" href="{{ asset('/images/logo500x500.png') }}">
    <link rel="manifest" href="{{ asset('/manifest.json') }}">
    <link href="{{ mix('/css/app.css') }}" rel="stylesheet" />
    @inertiaHead
    <style>
        :root {
            font-family: 'Poppins', sans-serif;
        }
    </style>
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
