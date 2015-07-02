<?php

    $directory = "poster_archive/";
    $images = glob($directory . "*.jpg");

?>
<html>
  <head>
    <meta name="description" content="experiment 1">
    <meta name="keywords" content="">
    <meta name="author" content="Amir Houieh">
    <meta charset="UTF-8">

    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="csi/jquery-2.1.0.min.js"></script>
    <script src="csi/jquery-ui.min.js"></script>
    <script src="imgData.js"></script>
    <script src="csi/utils.js"></script>
    <script src="csi/Colors.js"></script>
    <script src="csi/Slider.js"></script>
    <script src="csi/init.js"></script>
  </head>

  <body>
  <div id="slider-wrapper">
    <div id="sliderUi">
        <div class="handle" id="handle-l"></div>
        <div class="handle" id="handle-r"></div>
    </div>
  </div>
  <div id="grid"></div>
  </body>

</html>