import * as PIXI from 'pixi.js'

const app = new PIXI.Application({ width: 640, height: 480 });

document.body.appendChild(app.view);

const piyo = new PIXI.Graphics();
piyo.beginFill(0xf0f000);
piyo.drawCircle(100, 100, 20);
piyo.endFill();
app.stage.addChild(piyo);