import * as PIXI from 'pixi.js'

const app = new PIXI.Application({ width: 800, height: 600 });

document.body.appendChild(app.view);

// 表示をする画像の最大数を指定
let maxSprites = 100;

// 最も処理効率が高いParticleContainerを用いる。
// 処理効率の代わりに、マスク、フィルタなどの機能が使えない。
// https://pixijs.download/dev/docs/PIXI.ParticleContainer.html
let sprites = new PIXI.ParticleContainer(maxSprites, {
  vertices: true, // scaleを変更する場合はtrue
  position: true, // positionを変更する場合はtrue
  rotation: true, // rotationを変更する場合はtrue
});

app.stage.addChild(sprites);

// テクスチャのサイズは縦横ともに2のべき乗とするのが最も処理効率がよい。
// kyoco128x128.pngは縦横128px
const tx = PIXI.Texture.from('kyoco128x128.png');

const setRandomProps = (spr) => {
  // 中心位置を指定
  spr.anchor.set(0.5);

  // 左右の開始位置をずらす
  spr.x = Math.random() * app.screen.width;
  // 元のx座標をorgXにコピーしておく
  spr.orgX = spr.x;

  // 上下の開始位置をずらす（負の値なので画面外）
  spr.y = - Math.random() * app.screen.height;

  // サイズを変更
  // Math.random()は 0以上1未満の値を返す
  spr.scale.set(0.05 + Math.random());

  // speedプロパティを独自に追加して、速度を格納しておく
  spr.speed = 1 + Math.random() * 3;

  // 角度はラジアンで指定。左右に最大45度
  spr.rotation = Math.PI / (-2.0 + 4.0 * Math.random());

  return spr;
};

for (let i = 0; i < maxSprites; i++){
  // 同じテクスチャを使いまわす
  const kyoco = PIXI.Sprite.from(tx);
  setRandomProps(kyoco);
  sprites.addChild(kyoco);
}

// マウス位置を取得
let mouseX = 0;
let mouseY = 0;
app.stage.interactive = true;
app.stage.hitArea = app.screen; // app.stageをinteractiveにするときは必須。
app.stage.on('pointermove', event => {
    console.log(`[stage] screen(${event.screen.x}, ${event.screen.y}))`);
    mouseX = event.screen.x;
    mouseY = event.screen.y;
});

let time = 0.0;
app.ticker.add(delta => {
  time += delta;

  sprites.children.forEach(spr => {
    // まっすぐ落ちる
    spr.x = spr.orgX;
    // 元のx座標に対して、最大でスプライト幅の半分までsin関数で左右にゆらぐ
    spr.x = spr.orgX + spr.width / 2.0 * Math.sin(time/50);

    // 基本課題：マウスとの距離が128以内だと回転する

    



    // どれも同じ速度で落ちる
    spr.y += 3;
    // y座標をそれぞれのspeedの値だけ増やす
    spr.y += spr.speed;

    // 下端に達したスプライトは上へ戻す
    // スプライトの座標原点は中心なので、サイズの半分を足しておく
    if (spr.y > app.screen.height + spr.width / 2.0) {
      setRandomProps(spr);
    }
  })
});
