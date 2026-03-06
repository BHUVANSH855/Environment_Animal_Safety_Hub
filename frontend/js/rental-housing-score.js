document.addEventListener("DOMContentLoaded",()=>{

const btn=document.getElementById("calculate-score");

btn.addEventListener("click",(e)=>{

e.preventDefault();

const address=document.getElementById("address").value.trim();

if(!address) return;


const scores={

heatSafety:+document.getElementById("heat-safety").value,

floodExposure:+document.getElementById("flood-exposure").value,

ventilation:+document.getElementById("ventilation").value,

insulation:+document.getElementById("insulation").value,

backupWater:+document.getElementById("backup-water").value,

emergency:+document.getElementById("emergency-readiness").value

};


const total=Math.round(

(scores.heatSafety+

(10-scores.floodExposure)+

scores.ventilation+

scores.insulation+

scores.backupWater+

scores.emergency)/6

);

renderSummary(address,scores,total);

renderChart(scores);

});

});


function renderSummary(address,scores,total){

document.getElementById("score-summary").innerHTML=`

<b>Rental Address:</b> ${address}<br>

Heat Safety: ${scores.heatSafety}/10<br>

Flood Exposure: ${scores.floodExposure}/10<br>

Ventilation: ${scores.ventilation}/10<br>

Insulation: ${scores.insulation}/10<br>

Backup Water: ${scores.backupWater}/10<br>

Emergency Readiness: ${scores.emergency}/10

<hr>

<b>Climate Resilience Score:</b>

<span style="font-size:20px;color:#2e7d32">${total}/10</span>

`;

}



function renderChart(scores){

const chart=document.getElementById("risk-chart");

chart.innerHTML="";

const canvas=document.createElement("canvas");

canvas.width=400;

canvas.height=220;

chart.appendChild(canvas);

const ctx=canvas.getContext("2d");

const values=[

scores.heatSafety,

10-scores.floodExposure,

scores.ventilation,

scores.insulation,

scores.backupWater,

scores.emergency

];

const labels=[

"Heat",

"Flood",

"Ventilation",

"Insulation",

"Water",

"Emergency"

];

const cx=200;

const cy=110;

const radius=80;

ctx.translate(cx,cy);

for(let i=0;i<6;i++){

const angle=(Math.PI*2/6)*i;

ctx.beginPath();

ctx.moveTo(0,0);

ctx.lineTo(Math.cos(angle)*radius,Math.sin(angle)*radius);

ctx.strokeStyle="#2e7d32";

ctx.stroke();

ctx.fillText(labels[i],Math.cos(angle)*(radius+20),Math.sin(angle)*(radius+20));

}

ctx.beginPath();

for(let i=0;i<6;i++){

const angle=(Math.PI*2/6)*i;

const r=(values[i]/10)*radius;

if(i===0) ctx.moveTo(Math.cos(angle)*r,Math.sin(angle)*r);

else ctx.lineTo(Math.cos(angle)*r,Math.sin(angle)*r);

}

ctx.closePath();

ctx.fillStyle="rgba(46,125,50,0.3)";

ctx.fill();

ctx.strokeStyle="#2e7d32";

ctx.stroke();

}