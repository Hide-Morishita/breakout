window.addEventListener("load", () =>{
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d")
  // 初期位置
  var x = canvas.width/2;
  var y = canvas.height-100;
  // 速度調整、向き調整
  var dx = -1;
  var dy = -1;
  // 衝突検知
  var ballRadius = 10;
  // パドルの追加
  var paddleHeight = 10;
  var paddleWidth = 150;
  var paddleX = (canvas.width-paddleWidth)/2;
  // ボタンの初期化
  var rightPressed = false;
  var leftPressed = false;
  // スコア
  var score = 0;
  // ライフ
  var lives = 3;
  // ブロックの値
  var brickRowCount = 4;
  var brickColumnCount = 6;
  var brickWidth = 75;
  var brickHeight = 30;
  var brickPadding = 30;
  var brickOffsetTop = 50;
  var brickOffsetLeft = 100;
  var bricks = [];
  for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
  // イベント発火した際の関数の呼び出し
  document.addEventListener("keydown", KeyDownHandler, false);
  document.addEventListener("keyup", KeyUpHandler, false);
  // マウス操作
  document.addEventListener("mousemove", mouseMoveHandler, false);
  function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
  }
  // キーが押された時の処理
  function KeyDownHandler(e){
    // あらゆるブラウザに対応するため、Rightもいれている
    if(e.key == "Right" || e.key == "ArrowRight"){
      rightPressed = true;
    } else if(e.key == "Left" || e.key == "ArrowLeft"){
      leftPressed = true;
    }
  }
  // キーが離された時の処理
  function KeyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
      rightPressed = false;
    } else if(e.key == "Left" || e.key == "ArrowLeft"){
      leftPressed = false;
    }
  }
  // ブロック衝突判定
  function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
      for(var r=0; r<brickRowCount; r++) {
        var b = bricks[c][r];
        if(b.status == 1){
          if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
            dy = -dy;
            b.status = 0;
            score++;
            if(score == brickRowCount*brickColumnCount) {
              alert("ゲームクリア, すばらしい！");
              document.location.reload();
            }
          }
        }
      }
    }
  }
  // スコア表示
  function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("得点: "+score, 0, 20);
  }
  // ライフ表示
  function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "orange";
    ctx.fillText("ライフ: "+lives, canvas.width-100, 20);
  }

  // ボール描画関数
  function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
  }
  // パドル描画
  function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-50, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD"
    ctx.fill();
    ctx.closePath();
  }
  // ブロックの描画
  function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
      for(var r=0; r<brickRowCount; r++) {
        if(bricks[c][r].status == 1){
          var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
          var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "green";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }
  function draw(){
    // フレームごとの描写を削除するためのコード
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall(); // 関数drawの呼び出し
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();
    // 壁・パドル・ブロック跳ね返りのコード
    if(x + dx < ballRadius || x + dx > canvas.width-ballRadius){
      // 左側が0、右側は横幅 円の半径分を差し引く
      dx = -dx; // 進む方向を変えている
    }
    if(y + dy < ballRadius) {
      // 上側が0、下側は高さ分 円の半径分を差し引く
      dy = -dy; // 進む方向を変えている
    }else if(y + dy > canvas.height-ballRadius){
      lives--;
      if(!lives){
        alert("ゲームオーバー");
        document.location.reload(); // 現在のページを再読み込みしてくれる
        // clearInterval(interval);
      }else{
        x = canvas.width/2;
        y = canvas.height-100;
        dx = dx; // ライフが減った時のスピードを引き継がせる
        dy = dy; // ライフが減った時のスピードを引き継がせる
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }else if(y + dy > canvas.height-50-ballRadius){
      if(x > paddleX && x < paddleX + paddleWidth){
        // パドル跳ね返りの処理
        dy = -dy*1.1; // 徐々にスピードを早める処理
      }
    }
    // パドルの動き制御
    if(rightPressed && paddleX < canvas.width-paddleWidth){
      paddleX += 10;
    }else if(leftPressed && paddleX > 0){
      paddleX -= 10;
    }
    // ボールを描画するためのコード
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
  }
  draw();
  // //beginPath~closePathまでが一括り
  // //■
  // ctx.beginPath();
  // ctx.rect(20, 40, 300, 400);   //(左端からの座標, 上端からの座標, 幅, 高さ)
  // ctx.fillStyle = "#FF0000";
  // ctx.fill();
  // ctx.closePath();
  // //●
  // ctx.beginPath();
  // ctx.arc(240, 160, 20, 0, Math.PI*2, false);
  // ctx.fillStyle = "green";
  // ctx.fill();
  // ctx.closePath;
  // //塗りつぶしなし■
  // ctx.beginPath();
  // ctx.rect(160, 10, 100, 40);
  // ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
  // ctx.stroke();
  // ctx.closePath();
})