//グローバル変数宣言
let pacPos = { x: 0, y: 0 };
let enemyPos = [//0:blue 1:red 2:green 3:fakemoney
  { x: 0, y: 0, dir: "left", priority: { "right": 0, "left": 1, "up": 2, "down": 0 } },
  { x: 0, y: 0, dir: "right", priority: { "right": 1, "left": 2, "up": 3, "down": 0 } },
  { x: 0, y: 0, dir: "right", priority: { "right": 2, "left": 3, "up": 0, "down": 1 } },
  { x: 0, y: 0, dir: "right", priority: { "right": 3, "left": 0, "up": 1, "down": 2 } },
];
let area = //0:なし　1:パックマン 2:ブロック 3~6:敵 7:エサ
  [[0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 2, 0, 2, 2, 2, 0, 0],
  [0, 2, 0, 0, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 0],
  [0, 2, 2, 0, 0, 0, 0, 0, 0],
  [0, 2, 2, 0, 2, 2, 2, 0, 0],
  [0, 0, 0, 0, 2, 2, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
let score = 0;//得点
let time = 0;//時間
let delayCount = 0;//各敵スピード調整用
let audioId = 0;//audioエレメント消去用
const FIELD_SIZE = area.length;//エリア(フィールド)の横縦幅
const EMPTY = 0;
const PACMAN = 1;
const BLOCK = 2;
const ENEMY1 = 3;
const ENEMY2 = 4;
const ENEMY3 = 5;
const ENEMY4 = 6;
const BAIT = 7;
const SOUND_DAMAGE_LINK = "sound/damage.mp3";
const SOUND_GET_LINK = "sound/getBait.mp3";


//DOC要素取得
let itemPac = document.getElementById("pac");
let field = document.getElementById("field");

//イベントリスナー設定
window.addEventListener("keydown", movePacman, true);

//初期画面作成
document.body.classList.add("dark-theme");
makeField();

/**
 * フィールド(HTML)の各エレメントを配置する
 */
function makeField() {
  field.style.height = (FIELD_SIZE + 2) * 16;
  field.style.width = (FIELD_SIZE + 2) * 16;

  //敵、パックマンの自動配置
  for (i = 0; i < 5; i++) {
    let x = 0;
    let y = 0;
    do {
      x = getRandomNum(FIELD_SIZE - 1, []);
      y = getRandomNum(FIELD_SIZE - 1, []);
    } while (area[y][x] !== 0);
    if (i === 4) {//パックマン
      area[y][x] = PACMAN;
      pacPos.x = x;
      pacPos.y = y;
      itemPac.style.top = `${(pacPos.y + 1) * 16}px`;
      itemPac.style.left = `${(pacPos.x + 1) * 16}px`;
    } else {//敵
      area[y][x] = i + 3;
    }
  }
  

  for (let i = 0; i < (FIELD_SIZE + 2); i++) {
    for (let j = 0; j < (FIELD_SIZE + 2); j++) {
      if ((i === 0) || (i === (FIELD_SIZE + 1)) || (j === 0) || (j === (FIELD_SIZE + 1))) {
        let brock = document.createElement("img");
        brock.src = "image/brock.png";
        brock.id = "brock";
        brock.style.top = `${i * 16}px`;
        brock.style.left = `${j * 16}px`;
        field.appendChild(brock);
      } else {
        if (area[i - 1][j - 1] === BLOCK) {
          let brock = document.createElement("img");
          brock.src = "image/brock.png";
          brock.id = "brock";
          brock.style.top = `${i * 16}px`;
          brock.style.left = `${j * 16}px`;
          field.appendChild(brock);
        } else if (area[i - 1][j - 1] === ENEMY1) {
          enemyPos[0].x = (j - 1) * 16;
          enemyPos[0].y = (i - 1) * 16;

          let enemy1 = document.createElement("img");
          enemy1.src = "image/enemy/enemy1.png";
          enemy1.id = "enemy1";
          enemy1.style.top = `${i * 16}px`;
          enemy1.style.left = `${j * 16}px`;
          field.appendChild(enemy1);
        } else if (area[i - 1][j - 1] === ENEMY2) {
          enemyPos[1].x = (j - 1) * 16;
          enemyPos[1].y = (i - 1) * 16;

          let enemy2 = document.createElement("img");
          enemy2.src = "image/enemy/enemy2.png";
          enemy2.id = "enemy2";
          enemy2.style.top = `${i * 16}px`;
          enemy2.style.left = `${j * 16}px`;
          field.appendChild(enemy2);
        } else if (area[i - 1][j - 1] === ENEMY3) {
          enemyPos[2].x = (j - 1) * 16;
          enemyPos[2].y = (i - 1) * 16;

          let enemy3 = document.createElement("img");
          enemy3.src = "image/enemy/enemy3.png";
          enemy3.id = "enemy3";
          enemy3.style.top = `${i * 16}px`;
          enemy3.style.left = `${j * 16}px`;
          field.appendChild(enemy3);
        } else if (area[i - 1][j - 1] === ENEMY4) {
          enemyPos[3].x = (j - 1) * 16;
          enemyPos[3].y = (i - 1) * 16;

          let enemy4 = document.createElement("img");
          enemy4.src = "image/money.png";
          enemy4.id = "enemy4";
          enemy4.style.top = `${i * 16}px`;
          enemy4.style.left = `${j * 16}px`;
          field.appendChild(enemy4);
        } else if (area[i - 1][j - 1] === EMPTY) {
          area[i - 1][j - 1] = BAIT;
          let money = document.createElement("img");
          money.src = "image/money.png";
          money.className = "money";
          money.id = "money" + (i - 1) + (j - 1);
          money.style.top = `${i * 16}px`;
          money.style.left = `${j * 16}px`;
          field.appendChild(money);
        }
      }
    }
  }

  //10ms毎に実行する処理
window.setInterval(function () {
    //ゲーム終了検知
    if (!finishDetect()) {
      document.getElementById("score").innerText = score;//スコア反映
      time++;
      document.getElementById("time").innerText = time / 100;//時間反映
    } else {
      document.getElementById("finNotice").innerText = "FINISH!!";
    }

    delayCount++;
    if (delayCount % 3 === 0) {/* 30ms毎 */
      moveEnemy(0)
    }
    if (delayCount % 7 === 0) {/* 70ms毎 */
      moveEnemy(1)
    }
    if (delayCount % 13 === 0) {/* 130ms毎 */
      moveEnemy(2)
    }
    if (delayCount % 30 === 0) {/* 300ms毎 */
      moveEnemy(3)
    }
  }, 10)
}

/**
 * パックマンが移動する
 * @param {number} info 押下したキーの情報
 */
function movePacman(info) {
  let oldPacX = pacPos.x;
  let oldPacY = pacPos.y;

  // 進行方向に回転　座標移動
  switch (info.key) {
    case "ArrowUp":/* ↑ */
      info.preventDefault();
      pacPos.y -= 1;
      itemPac.style.transform = "rotate(90deg)";
      break;

    case "ArrowDown":/* ↓ */
      info.preventDefault();
      pacPos.y += 1;
      itemPac.style.transform = "rotate(270deg)";
      break;

    case "ArrowRight":/* → */
      info.preventDefault();
      pacPos.x += 1;
      itemPac.style.transform = "rotate(180deg)";
      break;

    case "ArrowLeft":/* ← */
      info.preventDefault();
      pacPos.x -= 1;
      itemPac.style.transform = "rotate(0deg)";
      break;

    default:
      break;
  };

  /* エリア最大値対策 */
  if (pacPos.x < 0) {
    pacPos.x = 0;
  } else if (pacPos.x > (FIELD_SIZE - 1)) {
    pacPos.x = FIELD_SIZE - 1;
  } else if (pacPos.y < 0) {
    pacPos.y = 0;
  } else if (pacPos.y > (FIELD_SIZE - 1)) {
    pacPos.y = FIELD_SIZE - 1;
  } else if (area[pacPos.y][pacPos.x] === BLOCK) {//　ブロック対策
    pacPos.y = oldPacY;
    pacPos.x = oldPacX;
  } else if ((area[pacPos.y][pacPos.x] >= ENEMY1) && (area[pacPos.y][pacPos.x] <= ENEMY4)) {//敵に当たった
    lostMoney(area[pacPos.y][pacPos.x]);
    pacPos.y = oldPacY;
    pacPos.x = oldPacX;
  } else {//進行方向に進む
    if (area[pacPos.y][pacPos.x] === BAIT) {//金ゲット
      score++;
      field.removeChild(document.getElementById("money" + pacPos.y + pacPos.x));
      addAudioEffect(SOUND_GET_LINK);//ゲット音を鳴らす
    }
    area[oldPacY][oldPacX] = EMPTY;
    area[pacPos.y][pacPos.x] = PACMAN;
    itemPac.style.top = `${(pacPos.y + 1) * 16}px`;
    itemPac.style.left = `${(pacPos.x + 1) * 16}px`;
  }
}

/**
 * スコアを減点してパックマンを赤くする
 * fakemoneyとぶつかった場合はfakemoneyの画像を切り替える
 * @param {number} enemyNum 敵の数字 3:blue 4:red 5:green 6:fakemoney
 */
function lostMoney(enemyNum) {
  score -= 5;//スコア減点
  if (score < 0) {
    score = 0;
  }
  itemPac.style.filter = "hue-rotate(-60deg)";//パックマンを赤っぽくする
  window.setTimeout(function () { itemPac.style.filter = "hue-rotate(0deg)"; }, 500);//500ms後に元に戻す
  if (enemyNum === ENEMY4) {//fake moneyだったら
    smileFakemoney();
  }

  addAudioEffect(SOUND_DAMAGE_LINK);//ダメージ効果音を鳴らす
}

/**
 * fake moneyがニヤッとする
 */
function smileFakemoney() {
  document.getElementById("enemy4").src = "image/enemy/fakemoney.png";
  window.setTimeout(function () { document.getElementById("enemy4").src = "image/money.png"; }, 500);
}

/**
 * エリアのエサの有無を判定する関数
 * @returns {boolean} エサがあるかどうか 
 */
function finishDetect() {
  return area.filter(array => array.filter(num => num === BAIT).length > 0).length === 0;
}


/**
 * 敵が移動する
 * @param {number} enemyNum 敵の数字 0:blue 1:red 2:green 3:fakemoney
 */
function moveEnemy(enemyNum) {
  let oldX = 0;
  let oldY = 0;

  //方向転換
  if ((enemyPos[enemyNum].y % 16 === 0) && (enemyPos[enemyNum].x % 16 === 0)) {
    enemyPos[enemyNum].dir = turnEnemy(enemyNum, Math.floor((enemyPos[enemyNum].y + 8) / 16), Math.floor((enemyPos[enemyNum].x + 8) / 16));
  }

  oldX = enemyPos[enemyNum].x;
  oldY = enemyPos[enemyNum].y;
  switch (enemyPos[enemyNum].dir) {
    case "right":
      enemyPos[enemyNum].x++;
      break;

    case "left":
      enemyPos[enemyNum].x--;
      break;

    case "up":
      enemyPos[enemyNum].y--;
      break;

    case "down":
      enemyPos[enemyNum].y++;
      break;

    default:
      break;
  }

  if (enemyPos[enemyNum].x < 0) {
    enemyPos[enemyNum].x = 0;
  } else if (enemyPos[enemyNum].x > (16 * (FIELD_SIZE - 1))) {
    enemyPos[enemyNum].x = (16 * (FIELD_SIZE - 1));
  } else if (enemyPos[enemyNum].y < 0) {
    enemyPos[enemyNum].y = 0;
  } else if (enemyPos[enemyNum].y > (16 * (FIELD_SIZE - 1))) {
    enemyPos[enemyNum].y = (16 * (FIELD_SIZE - 1));
  }

  if (((enemyPos[enemyNum].y % 16) === 0) && ((enemyPos[enemyNum].x % 16) === 0)) {
    if (area[Math.floor((oldY + ((oldY - enemyPos[enemyNum].y) * 15)) / 16)][Math.floor((oldX + ((oldX - enemyPos[enemyNum].x) * 15)) / 16)] !== PACMAN) {
      area[Math.floor((oldY + ((oldY - enemyPos[enemyNum].y) * 15)) / 16)][Math.floor((oldX + ((oldX - enemyPos[enemyNum].x) * 15)) / 16)] = 0;
    }
  } else {
    if ((Math.floor((enemyPos[enemyNum].y + 15) / 16) < FIELD_SIZE) && (Math.floor((enemyPos[enemyNum].y + 15) / 16) >= 0)) {
      if ((Math.floor((enemyPos[enemyNum].x + 15) / 16) < FIELD_SIZE) && (Math.floor((enemyPos[enemyNum].x + 15) / 16) >= 0)) {
        area[Math.floor((enemyPos[enemyNum].y + 15) / 16)][Math.floor((enemyPos[enemyNum].x + 15) / 16)] = enemyNum + 3;
      }
    }
  }
  area[Math.floor((enemyPos[enemyNum].y) / 16)][Math.floor((enemyPos[enemyNum].x) / 16)] = enemyNum + 3;

  // 位置をHTMLに反映
  let enemy = document.getElementById("enemy" + (enemyNum + 1));
  enemy.style.top = `${enemyPos[enemyNum].y + 16}px`;
  enemy.style.left = `${enemyPos[enemyNum].x + 16}px`;

  // 餌が無かったら餌のIMAGEタグを削除する
  for (let k = 0; k < FIELD_SIZE; k++) {
    for (let j = 0; j < FIELD_SIZE; j++) {
      if (area[k][j] !== BAIT) {
        if (document.getElementById("money" + k + j) !== null) {
          field.removeChild(document.getElementById("money" + k + j));
        }
      }
    }
  }
}

/**
 * 交差点を検知して方向転換する
 * @param {number} enemyNum 0:blue 1:red 2:green 3:fakemoney
 * @param {number} y 敵のY座標
 * @param {number} x 敵のX座標
 */
function turnEnemy(enemyNum, y, x) {
  const enemyDir = enemyPos[enemyNum].dir;
  let isPossible = { "all": false, "right": false, "left": false, "up": false, "down": false };

  /* 行き止まり検知処理 */
  isPossible[enemyDir] = true;
  if ((enemyDir === "right") && (((area[y][x + 1] >= PACMAN) && (area[y][x + 1] <= ENEMY4)) || (x === (FIELD_SIZE - 1)))) {
    if (area[y][x + 1] === PACMAN) {
      lostMoney(enemyNum + 3);
    }
    isPossible.all = true;
    isPossible["right"] = false;
    isPossible["left"] = true;
  } else if ((enemyDir === "left") && (((area[y][x - 1] >= PACMAN) && (area[y][x - 1] <= ENEMY4)) || (x === 0))) {
    if (area[y][x - 1] === PACMAN) {
      lostMoney(enemyNum + 3);
    }
    isPossible.all = true;
    isPossible["right"] = true;
    isPossible["left"] = false;
  } else if (enemyDir === "up") {
    if (y === 0) {
      isPossible.all = true;
      isPossible["up"] = false;
      isPossible["down"] = true;
    } else if ((area[y - 1][x] >= PACMAN) && (area[y - 1][x] <= ENEMY4)) {
      isPossible.all = true;
      isPossible["up"] = false;
      isPossible["down"] = true;
      if (area[y - 1][x] === PACMAN) {
        lostMoney(enemyNum + 3);
      }
    }
  } else if (enemyDir === "down") {
    if (y === (FIELD_SIZE - 1)) {
      isPossible.all = true;
      isPossible["up"] = true;
      isPossible["down"] = false;
    } else if ((area[y + 1][x] >= PACMAN) && (area[y + 1][x] <= ENEMY4)) {
      isPossible.all = true;
      isPossible["up"] = true;
      isPossible["down"] = false;
      if (area[y + 1][x] === PACMAN) {
        lostMoney(enemyNum + 3);
      }
    }
  }

  /* 交差点検出処理 */
  const dirStr = ["right", "left", "up", "down"];
  if (enemyDir === "right" || enemyDir === "left") {
    dirStr.shift();
    dirStr.shift();
  } else {
    dirStr.pop();
    dirStr.pop();
  }
  for (const dir of dirStr) {
    switch (dir) {
      case "right":
        if (x !== FIELD_SIZE - 1) {/* 右がエリア外じゃない */
          if ((area[y][x + 1] === EMPTY) || (area[y][x + 1] === BAIT)) {/* 右が空または餌 */
            isPossible[dir] = true;
            isPossible.all = true;
          }
        }
        break;
      case "left":
        if (x !== 0) {/* 左がエリア外じゃない */
          if ((area[y][x - 1] === EMPTY) || (area[y][x - 1] === BAIT)) {/* 左が空または餌 */
            isPossible[dir] = true;
            isPossible.all = true;
          }
        }
        break;
      case "up":
        if (y !== 0) {/* 上がエリア外じゃない */
          if ((area[y - 1][x] === EMPTY) || (area[y - 1][x] === BAIT)) {/* 上が空または餌 */
            isPossible[dir] = true;
            isPossible.all = true;
          }
        }
        break;
      case "down":
        if (y !== FIELD_SIZE - 1) {/* 下がエリア外じゃない */
          if ((area[y + 1][x] === EMPTY) || (area[y + 1][x] === BAIT)) {/* 下が空または餌 */
            isPossible[dir] = true;
            isPossible.all = true;
          }
        }
        break;
      default:
        break;
    }
  }

  if (isPossible.all) {/* ターン可能なら */
    delete isPossible.all;
    let dirNo = { 'right': 0, 'left': 1, 'up': 2, 'down': 3 };
    let exclusionNumber = [];
    for (const key in isPossible) {
      if (!isPossible[key]) {/* ターン不可能だったら */
        exclusionNumber.push(dirNo[key]);
      }
    }

    let confDirNum = getRandomNum(3, exclusionNumber);
    return Object.keys(dirNo).find((key) => dirNo[key] === confDirNum);
  } else {
    return enemyDir;/* そのまま */
  }
}


/**
 * ランダムな値を取得する関数
 * @param {number} maxNum 0以上maxNum以下の値を生成
 * @param {array} exclusionNum 取得する範囲から除外したい値
 */
function getRandomNum(maxNum, exclusionNum) {
  let randNum = 0;
  do {
    randNum = Math.floor(Math.random() * (maxNum + 1));
  } while (exclusionNum.includes(randNum));
  return randNum;
}

/**
 * 効果音を鳴らす
 * @param {string} playFileLink 再生する音源ファイルパス
 * @returns {number} 返り値の説明
 */
function addAudioEffect(playFileLink) {
  //効果音鳴動処理
  sound = document.createElement("audio");
  sound.src = playFileLink;
  sound.id = "audio" + audioId;
  sound.autoplay = true;
  field.appendChild(sound);
  const id = sound.id;
  const func = () => { field.removeChild(document.getElementById(id)); };
  window.setTimeout(func, 500);
  audioId++;
};