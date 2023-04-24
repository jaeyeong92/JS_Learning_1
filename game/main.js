'use strict';
const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');


const popUp = document.querySelector('.pop-up');
const popUpRefresh = document.querySelector('.pop-up__refresh');
const popUpMessage = document.querySelector('.pop-up__message');

// sound
const carrotSound = new Audio('./sound/carrot_pull.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');
const winSound = new Audio('./sound/game_win.mp3');

let started = false;
let score = 0;
let timer = undefined;

field.addEventListener('click', (event) => {
  onFieldClick(event);
});

// 게임시작 클릭
gameBtn.addEventListener('click', () => {
  if(started){
    stopGame();
  } else {
    startGame();
  }
});

// 팝업(refresh)
popUpRefresh.addEventListener('click', () => {
  startGame();
  hidePopUp();
});

// 게임 정지
function stopGame(){
  started = false;
  stopGameTimer();
  hideGameButton();
  showPopUpWithText('REPLAY?');
  playSound(alertSound);
  stopSound(bgSound);

}

// 게임 시작
function startGame(){
  started = true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}

// 게임 끝
function finishGame(win){
  started = false;
  hideGameButton();
  if(win){
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
  stopGameTimer();
  stopSound(bgSound);
  showPopUpWithText(win? 'YOU WON🎉' : 'YOU LOST💥');
}

// 재생버튼 -> 정지버튼
function showStopButton(){
  const icon = gameBtn.querySelector('.fas');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  gameBtn.style.visibility = 'visible';
}

// 정지버튼 -> 재생버튼
function hideGameButton(){
  gameBtn.style.visibility = 'hidden';
}

// 타이머/스코어 보이기
function showTimerAndScore(){
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

// 타이머 작동
function startGameTimer(){
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if(remainingTimeSec <= 0){
      clearInterval(timer);
      finishGame(CARROT_COUNT === score);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

// 타이머 정지
function stopGameTimer(){
  clearInterval(timer);
}

// 타이머
function updateTimerText(time){
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerText = `${minutes} : ${seconds}`;
}

// 팝업
function showPopUpWithText(text){
  popUpMessage.innerText = text;
  popUp.classList.remove('pop-up--hide');
}

// 재시작 시,팝업
function hidePopUp(){
  popUp.classList.add('pop-up--hide');
}

// 게임 시작
function initGame(){
  field.innerHTML = '';
  score = 0;
  gameScore.innerText = CARROT_COUNT;
  // 벌레와 당근을 생성한 뒤 field에 추가
  addItem('carrot', CARROT_COUNT, 'img/carrot.png');
  addItem('bug', BUG_COUNT, 'img/bug.png');
}

// 필드 클릭
function onFieldClick(event){
  if(!started){
    return;
  }
  const target = event.target;
  if(target.matches('.carrot')){
    target.remove();
    playSound(carrotSound);
    score++;
    updateScoreBoard();
    if(score === CARROT_COUNT){
      finishGame(true);
    }
  } else if(target.matches('.bug')){
    finishGame(false);
  }
}

// 소리 재생
function playSound(sound){
  sound.currentTime = 0;
  sound.play();
}

// 소리 정지
function stopSound(sound){
  sound.pause();
}

// 스코어 업데이트
function updateScoreBoard(){
  gameScore.innerText = CARROT_COUNT - score;
}

function addItem(className, count, imgPath){
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;
  for(let i = 0; i < count; i++){
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function randomNumber(min, max){
  return Math.random() * (max - min) + min;
}







