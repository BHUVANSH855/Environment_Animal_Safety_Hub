document.addEventListener("DOMContentLoaded",()=>{

const form=document.getElementById("deviceForm");
const list=document.getElementById("devicesList");
const energy=document.getElementById("energyImpact");

let devices=[];

form.addEventListener("submit",e=>{

e.preventDefault();

const type=document.getElementById("deviceType").value;
const name=document.getElementById("deviceName").value;

if(!type||!name) return;

const energyUsage=Math.floor(Math.random()*15)+5;

devices.push({

name,
type,
status:"Online",
energy:energyUsage

});

renderDevices();
renderEnergy();

form.reset();

});


function renderDevices(){

list.innerHTML="";

devices.forEach((d,index)=>{

const div=document.createElement("div");

div.className="device";

div.innerHTML=`

<div>
<div class="device-name">${d.name}</div>
<div class="device-status">${d.status}</div>
</div>

<button onclick="toggleDevice(${index})">Toggle</button>

`;

list.appendChild(div);

});

}


function renderEnergy(){

energy.innerHTML="";

let total=0;

devices.forEach(d=>{

const value=d.status==="Online"?d.energy:0;

total+=value;

energy.innerHTML+=`

<div class="energy-row">
<span>${d.name}</span>
<span class="energy-value">${value} kWh</span>
</div>

`;

});

energy.innerHTML+=`

<hr>

<div class="energy-row">
<strong>Total</strong>
<strong class="energy-value">${total} kWh</strong>
</div>

`;

}


window.toggleDevice=function(index){

devices[index].status=

devices[index].status==="Online"?"Offline":"Online";

renderDevices();
renderEnergy();

};

});