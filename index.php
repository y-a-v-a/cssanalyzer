<?php
header("Access-Control-Allow-Origin: *");
?>
<!doctype html>
<head>
    <title>testdoc</title>
    <style>
    body {
        background: #efefef;
    }
    p {
        font-style: bold;
    }
    h1, h2 {
        color: red;
    }
    * + * {
        margin-bottom: 10px;
    }
    html, body > article h1 + h1 {
        color: pink;
    }
    </style>
</head>
<body>
    <article>hello word</article>
    <script src="analyzer.js"></script>
</body>
