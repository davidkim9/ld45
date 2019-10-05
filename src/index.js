import '../style/main.scss';

import MainController from './controller/main-controller';

let canvas = document.getElementById("artboard");
let mainController = new MainController(canvas);

mainController.init();