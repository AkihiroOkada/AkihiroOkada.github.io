//グローバル変数宣言
let pacPos = { x: 0, y: 0 };
let enemyPos = [//0:blue 1:red 2:green 3:fakemoney
  { x: 0, y: 0, dir: "right", priority: { "right": 0, "left": 1, "up": 2, "down": 0 } },
  { x: 0, y: 0, dir: "right", priority: { "right": 1, "left": 2, "up": 3, "down": 0 } },
  { x: 0, y: 0, dir: "right", priority: { "right": 2, "left": 3, "up": 0, "down": 1 } },
  { x: 0, y: 0, dir: "right", priority: { "right": 3, "left": 0, "up": 1, "down": 2 } },
];
let area = //0:なし　1:パックマン 2:ブロック 3~6:敵 7:金
  [[1, 0, 0, 0, 0, 0, 3, 0],
  [0, 2, 2, 0, 2, 2, 2, 0],
  [0, 2, 0, 0, 2, 0, 0, 0],
  [0, 0, 0, 4, 2, 0, 0, 0],
  [0, 2, 2, 0, 0, 0, 0, 0],
  [0, 2, 2, 0, 2, 2, 2, 0],
  [0, 0, 0, 6, 2, 2, 2, 0],
  [0, 0, 0, 0, 0, 0, 5, 0]];
let score = 0;//得点
let time = 0;//時間

//DOC要素取得
let itemPac = document.getElementById("pac");
let field = document.getElementById("field");


window.addEventListener("keydown", function (info) {
  let oldPacX = pacPos.x;
  let oldPacY = pacPos.y;

  // 進行方向に回転　座標移動
  switch (info.key) {
    case "ArrowUp":/* ↑ */
      pacPos.y -= 1;
      itemPac.style.transform = "rotate(90deg)";
      break;

    case "ArrowDown":/* ↓ */
      pacPos.y += 1;
      itemPac.style.transform = "rotate(270deg)";
      break;

    case "ArrowRight":/* → */
      pacPos.x += 1;
      itemPac.style.transform = "rotate(180deg)";
      break;

    case "ArrowLeft":/* ← */
      pacPos.x -= 1;
      itemPac.style.transform = "rotate(0deg)";
      break;

    default:
      break;
  };

  /* エリア最大値対策 */
  if (pacPos.x < 0) {
    pacPos.x = 0;
  } else if (pacPos.x > 7) {
    pacPos.x = 7;
  } else if (pacPos.y < 0) {
    pacPos.y = 0;
  } else if (pacPos.y > 7) {
    pacPos.y = 7;
  } else if (area[pacPos.y][pacPos.x] === 2) {//　ブロック対策
    pacPos.y = oldPacY;
    pacPos.x = oldPacX;
  } else if ((area[pacPos.y][pacPos.x] >= 3) && (area[pacPos.y][pacPos.x] <= 6)) {//敵に当たった
    lostMoney(area[pacPos.y][pacPos.x]);
    pacPos.y = oldPacY;
    pacPos.x = oldPacX;
  } else {//進行方向に進む
    if (area[pacPos.y][pacPos.x] === 7) {//金ゲット
      getMoney();
      field.removeChild(document.getElementById("money" + pacPos.y + pacPos.x));
    }
    area[oldPacY][oldPacX] = 0;
    area[pacPos.y][pacPos.x] = 1;
    itemPac.style.top = `${(pacPos.y + 1) * 16}px`;
    itemPac.style.left = `${(pacPos.x + 1) * 16}px`;
  }
});

function lostMoney(enemyNum) {
  score -= 5;//スコア減点
  if (score < 0) {
    score = 0;
  }
  itemPac.style.filter = "hue-rotate(-60deg)";//パックマンを赤っぽくする
  window.setTimeout(function () { itemPac.style.filter = "hue-rotate(0deg)"; }, 500);//500ms後に元に戻す
  if (enemyNum === 6) {
    smileFakemoney();
  }
}

function smileFakemoney() {
  document.getElementById("enemy4").src = "image/enemy/fakemoney.png";
  window.setTimeout(function () { document.getElementById("enemy4").src = "image/money.png"; }, 500);
}

//初期画面作成
document.body.classList.add("dark-theme");
makeField();
function makeField() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if ((i === 0) || (i === 9) || (j === 0) || (j === 9)) {
        let brock = document.createElement("img");
        brock.src = "image/brock.png";
        brock.id = "brock";
        brock.style.top = `${i * 16}px`;
        brock.style.left = `${j * 16}px`;
        field.appendChild(brock);
      } else {
        if (area[i - 1][j - 1] === 2) {
          let brock = document.createElement("img");
          brock.src = "image/brock.png";
          brock.id = "brock";
          brock.style.top = `${i * 16}px`;
          brock.style.left = `${j * 16}px`;
          field.appendChild(brock);
        } else if (area[i - 1][j - 1] === 3) {
          enemyPos[0].x = (j - 1) * 16;
          enemyPos[0].y = (i - 1) * 16;

          let enemy1 = document.createElement("img");
          enemy1.src = "image/enemy/enemy1.png";
          enemy1.id = "enemy1";
          enemy1.style.top = `${i * 16}px`;
          enemy1.style.left = `${j * 16}px`;
          field.appendChild(enemy1);
        } else if (area[i - 1][j - 1] === 4) {
          enemyPos[1].x = (j - 1) * 16;
          enemyPos[1].y = (i - 1) * 16;

          let enemy2 = document.createElement("img");
          enemy2.src = "image/enemy/enemy2.png";
          enemy2.id = "enemy2";
          enemy2.style.top = `${i * 16}px`;
          enemy2.style.left = `${j * 16}px`;
          field.appendChild(enemy2);
        } else if (area[i - 1][j - 1] === 5) {
          enemyPos[2].x = (j - 1) * 16;
          enemyPos[2].y = (i - 1) * 16;

          let enemy3 = document.createElement("img");
          enemy3.src = "image/enemy/enemy3.png";
          enemy3.id = "enemy3";
          enemy3.style.top = `${i * 16}px`;
          enemy3.style.left = `${j * 16}px`;
          field.appendChild(enemy3);
        } else if (area[i - 1][j - 1] === 6) {
          enemyPos[3].x = (j - 1) * 16;
          enemyPos[3].y = (i - 1) * 16;

          let enemy4 = document.createElement("img");
          enemy4.src = "image/money.png";
          enemy4.id = "enemy4";
          enemy4.style.top = `${i * 16}px`;
          enemy4.style.left = `${j * 16}px`;
          field.appendChild(enemy4);
        } else if (area[i - 1][j - 1] === 0) {
          area[i - 1][j - 1] = 7;
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
}


function getMoney() {
  score++;
}

function finishDetect() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (area[i][j] === 7) {
        return false;
      }
    }
  }
  return true;
}

let timeCount = 0;
window.setInterval(function () {
  //ゲーム終了検知
  if (finishDetect()) {
    // location.href = "annouce.html";
  } else {
    document.getElementById("score").innerText = score;//スコア反映

    time++;
    document.getElementById("time").innerText = time / 100;//時間反映
  }

  timeCount++;
  if (timeCount % 3 === 0) {
    moveEnemy(0)
  }
  if (timeCount % 7 === 0) {
    moveEnemy(1)
  }
  if (timeCount % 13 === 0) {
    moveEnemy(2)
  }
  if (timeCount % 30 === 0) {
    moveEnemy(3)
  }
}, 10)


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
  } else if (enemyPos[enemyNum].x > 112) {
    enemyPos[enemyNum].x = 112;
  } else if (enemyPos[enemyNum].y < 0) {
    enemyPos[enemyNum].y = 0;
  } else if (enemyPos[enemyNum].y > 112) {
    enemyPos[enemyNum].y = 112;
  }



  if (((enemyPos[enemyNum].y % 16) === 0) && ((enemyPos[enemyNum].x % 16) === 0)) {
    if (area[Math.floor((oldY + ((oldY - enemyPos[enemyNum].y) * 15)) / 16)][Math.floor((oldX + ((oldX - enemyPos[enemyNum].x) * 15)) / 16)] !== 1) {
      area[Math.floor((oldY + ((oldY - enemyPos[enemyNum].y) * 15)) / 16)][Math.floor((oldX + ((oldX - enemyPos[enemyNum].x) * 15)) / 16)] = 0;
    }
  } else {
    if ((Math.floor((enemyPos[enemyNum].y + 15) / 16) <= 7) && (Math.floor((enemyPos[enemyNum].y + 15) / 16) >= 0)) {
      if ((Math.floor((enemyPos[enemyNum].x + 15) / 16) <= 7) && (Math.floor((enemyPos[enemyNum].x + 15) / 16) >= 0)) {
        area[Math.floor((enemyPos[enemyNum].y + 15) / 16)][Math.floor((enemyPos[enemyNum].x + 15) / 16)] = enemyNum + 3;
      }
    }
  }
  area[Math.floor((enemyPos[enemyNum].y) / 16)][Math.floor((enemyPos[enemyNum].x) / 16)] = enemyNum + 3;

  /* 位置をHTMLに反映 */
  let enemy = document.getElementById("enemy" + (enemyNum + 1));
  enemy.style.top = `${enemyPos[enemyNum].y + 16}px`;
  enemy.style.left = `${enemyPos[enemyNum].x + 16}px`;

  for (let k = 0; k < 8; k++) {
    for (let j = 0; j < 8; j++) {
      if (area[k][j] !== 7) {
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
  let isDeadEnd = false;

  /* 行き止まり検知処理 */
  if ((enemyPos[enemyNum].dir === "right") && (((area[y][x + 1] >= 1) && (area[y][x + 1] <= 6)) || (x === 7))) {
    if (area[y][x + 1] === 1) {
      lostMoney(enemyNum + 3);
    }
    isDeadEnd = true;
  } else if ((enemyPos[enemyNum].dir === "left") && (((area[y][x - 1] >= 1) && (area[y][x - 1] <= 6)) || (x === 0))) {
    if (area[y][x - 1] === 1) {
      lostMoney(enemyNum + 3);
    }
    isDeadEnd = true;
  } else if (enemyPos[enemyNum].dir === "up") {
    if (y === 0) {
      isDeadEnd = true;
    } else if ((area[y - 1][x] >= 1) && (area[y - 1][x] <= 6)) {
      isDeadEnd = true;
      if (area[y - 1][x] === 1) {
        lostMoney(enemyNum + 3);
      }
    }
  } else if (enemyPos[enemyNum].dir === "down") {
    if (y === 7) {
      isDeadEnd = true;
    } else if ((area[y + 1][x] >= 1) && (area[y + 1][x] <= 6)) {
      isDeadEnd = true;
      if (area[y + 1][x] === 1) {
        lostMoney(enemyNum + 3);
      }
    }
  }

  if ((enemyPos[enemyNum].y % 16 === 0) && (enemyPos[enemyNum].x % 16 === 0) && isDeadEnd) {/* ちょうど真ん中かつ行き止まり */
    /* 交差点検出処理 */
    for (const dir of ["right", "left", "up", "down"]) {
      if (dir !== enemyDir) {/* 今の向き以外 */
        switch (dir) {
          case "right":
            if (x !== 7) {/* 右がエリア外じゃない */
              if ((area[y][x + 1] === 0) || (area[y][x + 1] === 7)) {/* 右が空または金 */
                isPossible[dir] = true;
                isPossible.all = true;
              }
            }
            break;

          case "left":
            if (x !== 0) {/* 左がエリア外じゃない */
              if ((area[y][x - 1] === 0) || (area[y][x - 1] === 7)) {/* 左が空または金 */
                isPossible[dir] = true;
                isPossible.all = true;
              }
            }
            break;

          case "up":
            if (y !== 0) {/* 上がエリア外じゃない */
              if ((area[y - 1][x] === 0) || (area[y - 1][x] === 7)) {/* 上が空または金 */
                isPossible[dir] = true;
                isPossible.all = true;
              }
            }
            break;

          case "down":
            if (y !== 7) {/* 下がエリア外じゃない */
              if ((area[y + 1][x] === 0) || (area[y + 1][x] === 7)) {/* 下が空または金 */
                isPossible[dir] = true;
                isPossible.all = true;
              }
            }
            break;

          default:
            break;
        }
      }
    }

    if (isPossible.all) {/* ターン可能なら */
      let priorityNum = 10;
      let confDir = "";

      delete isPossible.all;
      
      for (const key in isPossible) {

        if (isPossible[key] && (priorityNum > enemyPos[enemyNum].priority[key])) {
          priorityNum = enemyPos[enemyNum].priority[key];
          confDir = key;
        }
      }
      return confDir;
    } else {
      return enemyDir;/* そのまま */
    }
  } else {
    return enemyDir;/* そのまま */
  }
}