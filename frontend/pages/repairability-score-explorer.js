const products = [

{
name:"EcoSmart Phone",
partsAvailability:"High",
toolComplexity:"Low",
repairGuides:"Available",
expectedLifespan:6,
repairScore:9.2,
actions:["Replace battery","Upgrade storage"],
impact:"Reduced e-waste",
history:[
{year:2024,event:"Battery replaced"},
{year:2025,event:"Screen repaired"}
]
},

{
name:"GreenLaptop X",
partsAvailability:"Medium",
toolComplexity:"Medium",
repairGuides:"Partial",
expectedLifespan:8,
repairScore:7.5,
actions:["Upgrade RAM","Replace keyboard"],
impact:"Longer device life",
history:[
{year:2023,event:"RAM upgraded"}
]
},

{
name:"Solar Blender",
partsAvailability:"Low",
toolComplexity:"High",
repairGuides:"None",
expectedLifespan:3,
repairScore:4.1,
actions:["Replace motor"],
impact:"Short lifespan device",
history:[
{year:2025,event:"Motor failed"}
]
}

];


const visual=document.getElementById("repairScoreVisual");
const actions=document.getElementById("repairScoreActions");
const impact=document.getElementById("repairScoreImpact");
const history=document.getElementById("repairScoreHistory");



function renderVisual(){

visual.innerHTML="";

products.forEach(p=>{

visual.innerHTML+=`

<div class="visual-row">

<strong>${p.name}</strong>

<div>Parts Availability: ${p.partsAvailability}</div>

<div>Tool Complexity: ${p.toolComplexity}</div>

<div>Repair Guides: ${p.repairGuides}</div>

<div>Expected Lifespan: ${p.expectedLifespan} years</div>

<div><b>Repair Score:</b> ${p.repairScore}</div>

</div>

`;

});

}



function renderActions(){

actions.innerHTML="";

products.forEach(p=>{

actions.innerHTML+=`

<div class="action-row">

<strong>${p.name}</strong>

<ul>

${p.actions.map(a=>`<li>${a}</li>`).join("")}

</ul>

</div>

`;

});

}



function renderImpact(){

impact.innerHTML="";

products.forEach(p=>{

impact.innerHTML+=`

<div class="impact-row">

<strong>${p.name}</strong>

<div>${p.impact}</div>

</div>

`;

});

}



function renderHistory(){

history.innerHTML="";

products.forEach(p=>{

history.innerHTML+=`

<div class="history-row">

<strong>${p.name}</strong>

<span>${p.history.map(h=>`${h.year}: ${h.event}`).join(" | ")}</span>

</div>

`;

});

}



renderVisual();
renderActions();
renderImpact();
renderHistory();



/* FEEDBACK */

const form=document.getElementById("repairScoreFeedbackForm");
const input=document.getElementById("repairScoreFeedbackInput");
const list=document.getElementById("repairScoreFeedbackList");


function renderFeedback(){

list.innerHTML="";

const feedbacks=JSON.parse(localStorage.getItem("repairFeedback")||"[]");

feedbacks.forEach(f=>{

list.innerHTML+=`<div class="feedback-row">${f}</div>`;

});

}


form.addEventListener("submit",(e)=>{

e.preventDefault();

const value=input.value.trim();

if(!value) return;

const feedbacks=JSON.parse(localStorage.getItem("repairFeedback")||"[]");

feedbacks.push(value);

localStorage.setItem("repairFeedback",JSON.stringify(feedbacks));

input.value="";

renderFeedback();

});


renderFeedback();