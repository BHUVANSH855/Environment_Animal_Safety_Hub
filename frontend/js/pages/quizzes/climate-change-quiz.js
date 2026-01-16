// Initialize AOS
AOS.init({ duration: 800, once: true });

// Theme Logic
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
if (localStorage.getItem('theme') === 'light') body.classList.add('light-theme');

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-theme');
  localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
});

// Quiz Data
const allQuestions = [
 {q:"What is climate change?",o:["Daily weather","Long-term temperature change","Rain only","Wind only"],a:1},
 {q:"Main cause of global warming?",o:["Trees","Greenhouse gases","Oxygen","Clouds"],a:1},
 {q:"Which gas traps heat?",o:["Oxygen","Carbon dioxide","Nitrogen","Helium"],a:1},
 {q:"Which activity harms climate?",o:["Planting trees","Burning fossil fuels","Recycling","Saving water"],a:1},
 {q:"How can kids help climate?",o:["Waste energy","Plant trees","Burn trash","Use plastic"],a:1},
 {q:"Effect of global warming?",o:["Ice melts","More forests","No change","Less sunlight"],a:0},
 {q:"Eco-friendly transport?",o:["Car","Plane","Cycle","Bike with fuel"],a:2},
 {q:"Saving electricity helps?",o:["More heat","Less pollution","More waste","Nothing"],a:1},
 {q:"Which is renewable energy?",o:["Coal","Solar","Oil","Gas"],a:1},
 {q:"Plastic waste causes?",o:["Clean ocean","Pollution","More fish","Cold water"],a:1},
 {q:"Planting trees helps because?",o:["Decoration","Absorb CO₂","Make noise","Waste land"],a:1},
 {q:"Climate change affects?",o:["Only animals","Only humans","Everyone","Nobody"],a:2},
 {q:"Which saves water?",o:["Fix leaks","Leave taps open","Waste water","Ignore"],a:0},
 {q:"Best habit?",o:["Reuse items","Throw trash","Burn waste","Ignore pollution"],a:0},
 {q:"Earth is getting?",o:["Colder","Warmer","Same","Frozen"],a:1}
];

let quiz=[],index=0,score=0,seconds=0,timer;
let userAnswers=[];

// DOM Elements
const timeSelect = document.getElementById('timeSelect');
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const reviewScreen = document.getElementById('reviewScreen');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const remarkEl = document.getElementById('remark');
const reviewList = document.getElementById('reviewList');
const qNumber = document.getElementById('q-number');

function startQuiz(){
  // Randomize 10 questions
  quiz = [...allQuestions].sort(()=>0.5-Math.random()).slice(0,10);
  seconds = parseInt(timeSelect.value);
  
  // Transition
  startScreen.style.display="none";
  quizScreen.style.display="block";
  
  loadQuestion();
  startTimer();
}

function startTimer(){
  updateTime();
  timer = setInterval(()=>{
    seconds--;
    updateTime();
    if(seconds<=0){ clearInterval(timer); showResult(); }
  },1000);
}

function updateTime(){
  let m = Math.floor(seconds/60);
  let s = seconds%60;
  timeEl.textContent = `${m}:${s<10?'0':''}${s}`;
  
  // Visual Alert for low time
  if(seconds < 10) timeEl.parentElement.style.color = "#FF5252";
}

function loadQuestion(){
  let q = quiz[index];
  qNumber.textContent = index + 1;
  questionEl.textContent = q.q;
  optionsEl.innerHTML = "";
  
  q.o.forEach((opt,i)=>{
    let btn = document.createElement("div");
    btn.className = "option";
    btn.textContent = opt;
    btn.onclick = () => selectOption(btn,i);
    optionsEl.appendChild(btn);
  });
}

function selectOption(el,i){
  document.querySelectorAll(".option").forEach(o=>o.classList.remove("selected"));
  el.classList.add("selected");
  userAnswers[index] = i;
}

function nextQuestion(){
  if(userAnswers[index]==null) {
    // Simple shake animation
    const btn = document.querySelector('.next-btn');
    btn.style.transform = "translateX(5px)";
    setTimeout(()=> btn.style.transform = "translateX(0)", 100);
    return;
  }
  
  if(userAnswers[index]===quiz[index].a) score++;
  index++;
  
  index < quiz.length ? loadQuestion() : showResult();
}

function showResult(){
  clearInterval(timer);
  quizScreen.style.display="none";
  resultScreen.style.display="block";
  
  scoreEl.textContent = `${score} / ${quiz.length}`;
  
  let percentage = (score/quiz.length)*100;
  if(percentage >= 80) remarkEl.textContent = "🌟 Climate Hero! Amazing!";
  else if(percentage >= 50) remarkEl.textContent = "👍 Good Job! Keep learning!";
  else remarkEl.textContent = "🌱 Don't give up! Try again!";
}

function showReview(){
  resultScreen.style.display="none";
  reviewScreen.style.display="block";
  reviewList.innerHTML="";
  
  quiz.forEach((q,i)=>{
    let userAnswer = userAnswers[i];
    let isCorrect = userAnswer === q.a;
    let userText = q.o[userAnswer] || "No Answer";
    let correctText = q.o[q.a];
    
    reviewList.innerHTML += `
      <div class="review-card" style="border-left-color: ${isCorrect?'var(--primary)':'var(--danger)'}">
        <p><strong>Q${i+1}:</strong> ${q.q}</p>
        <p>Your Answer: <span class="${isCorrect?'correct':'wrong'}">${userText}</span></p>
        ${!isCorrect ? `<p>Correct Answer: <span class="correct">${correctText}</span></p>` : ''}
      </div>`;
  });
}