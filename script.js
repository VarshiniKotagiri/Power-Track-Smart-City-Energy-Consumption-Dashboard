// ---------------- NAV ACTIVE ----------------
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// ---------------- GLOBAL DATA ----------------
let totalEnergy = 3176;
let peakLoad = 186;
let count = 13;
let loadValues = [185,170,110,130,160,150,135,90,45,30,85,125,110];
let loadLabels = ['12AM','1AM','3AM','5AM','7AM','9AM','11AM','1PM','3PM','5PM','7PM','9PM','11PM'];

let currentZone = "overall";
let loadChart;

// ---------------- LOAD DEFAULT ----------------
window.onload = function () {
  loadOverallCharts();
  startRealtime();
};

// ---------------- REAL-TIME SIMULATION ----------------
function startRealtime(){
  setInterval(() => {

    if(currentZone !== "overall") return; // only for overall

    let newLoad = Math.floor(Math.random() * 200);

    loadValues.push(newLoad);
    loadLabels.push("T" + loadLabels.length);

    if(loadValues.length > 13){
      loadValues.shift();
      loadLabels.shift();
    }

    loadChart.data.datasets[0].data = loadValues;
    loadChart.update();

    totalEnergy += newLoad;
    count++;

    if(newLoad > peakLoad) peakLoad = newLoad;

    let avg = totalEnergy / count;
    let lf = (avg / peakLoad) * 100;

    // Update KPI
    document.querySelectorAll(".kpi-value")[0].innerHTML = totalEnergy + ' <span style="font-size:14px;color:#7ab8cc">kWh</span>';
    document.querySelectorAll(".kpi-value")[1].innerHTML = newLoad + ' <span style="font-size:14px;color:#7ab8cc">kW</span>';
    document.querySelectorAll(".kpi-value")[2].innerHTML = peakLoad + ' <span style="font-size:14px;color:#7ab8cc">kW</span>';
    document.querySelectorAll(".kpi-value")[3].innerHTML = lf.toFixed(1) + '<span style="font-size:18px">%</span>';

  },2000);
}

// ---------------- OVERALL ----------------
function loadOverallCharts(){

  currentZone = "overall";

  loadChart = new Chart("loadCurveChart", {
    type: 'line',
    data: {
      labels: loadLabels,
      datasets: [{
        data: loadValues,
        borderColor: '#00f0ff',
        fill: true
      }]
    }
  });

  new Chart("zoneCompChart", {
    type: 'bar',
    data: {
      labels: ['Residential','Commercial','Industrial','Public'],
      datasets: [{ data: [110,155,200,75], backgroundColor: '#00f0ff' }]
    }
  });

  // ✅ Pie ONLY for overall
  new Chart("pieChart", {
    type: 'pie',
    data: {
      labels: ['Residential','Commercial','Industrial','Public'],
      datasets: [{
        data: [35,28,25,12],
        backgroundColor: ['#00f0ff','#00b8a0','#007a8a','#004d66']
      }]
    }
  });

  new Chart("weeklyChart", {
    type: 'line',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{ data: [310,400,340,500,450,590,540], borderColor: '#00f0ff' }]
    }
  });
}

// ---------------- ZONE SWITCH ----------------
function updateZone() {

  let zone = document.getElementById("zoneSelect").value;
  currentZone = zone;

  // Destroy all charts
  Chart.getChart("loadCurveChart")?.destroy();
  Chart.getChart("zoneCompChart")?.destroy();
  Chart.getChart("pieChart")?.destroy();
  Chart.getChart("weeklyChart")?.destroy();

  // ---------------- OVERALL ----------------
  if(zone === "overall"){
    loadOverallCharts();
    return;
  }

  // ---------------- RESIDENTIAL ----------------
  if(zone === "residential"){

    new Chart("loadCurveChart", {
      type: "bar",
      data: { labels:["Morning","Evening"], datasets:[{ data:[120,180], backgroundColor:["#00f0ff","#ff8c00"] }] }
    });

    new Chart("zoneCompChart", {
      type: "bar",
      data: { labels:["HVAC","Lighting","Kitchen","Electronics"], datasets:[{ data:[40,20,25,15], backgroundColor:"#00f0ff" }] }
    });

    new Chart("weeklyChart", {
      type:"line",
      data:{
        labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
        datasets:[
          { label:"Weekday", data:[200,210,220,230,240,0,0], borderColor:"#00f0ff" },
          { label:"Weekend", data:[0,0,0,0,0,260,280], borderColor:"#ff8c00" }
        ]
      }
    });

    // replaced pie → comparison graph
    new Chart("pieChart", {
      type:"bar",
      data:{ labels:["Average","Top 10%"], datasets:[{ data:[150,300], backgroundColor:"#00f0ff" }] }
    });
  }

  // ---------------- COMMERCIAL ----------------
  if(zone === "commercial"){

    new Chart("loadCurveChart", {
      type:"bar",
      data:{ labels:["Working","Non-working"], datasets:[{ data:[300,120], backgroundColor:"#00f0ff" }] }
    });

    new Chart("zoneCompChart", {
      type:"bar",
      data:{ labels:["HVAC","Lighting","Equipment"], datasets:[{ data:[50,20,30], backgroundColor:"#00f0ff" }] }
    });

    new Chart("weeklyChart", {
      type:"line",
      data:{ labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], datasets:[{ data:[400,420,430,440,450,200,150], borderColor:"#00f0ff" }] }
    });

    new Chart("pieChart", {
      type:"bar",
      data:{ labels:["Building A","B","C","D"], datasets:[{ data:[80,75,90,60], backgroundColor:"#00f0ff" }] }
    });
  }

  // ---------------- INDUSTRIAL ----------------
  if(zone === "industrial"){

    new Chart("loadCurveChart", {
      type:"bar",
      data:{ labels:["Unit A","Unit B","Unit C"], datasets:[{ data:[500,700,600], backgroundColor:"#00f0ff" }] }
    });

    new Chart("zoneCompChart", {
      type:"line",
      data:{ labels:["1","2","3","4","5"], datasets:[{ data:[600,610,605,620,615], borderColor:"#00f0ff" }] }
    });

    new Chart("weeklyChart", {
      type:"scatter",
      data:{ datasets:[{ data:[{x:100,y:500},{x:200,y:700},{x:300,y:900}], backgroundColor:"#00f0ff" }] }
    });

    new Chart("pieChart", {
      type:"bar",
      data:{ labels:["Normal","Peak"], datasets:[{ data:[600,900], backgroundColor:"#00f0ff" }] }
    });
  }

  // ---------------- PUBLIC ----------------
  if(zone === "public"){

    new Chart("loadCurveChart", {
      type:"bar",
      data:{ labels:["Day","Night"], datasets:[{ data:[120,300], backgroundColor:"#00f0ff" }] }
    });

    new Chart("zoneCompChart", {
      type:"bar",
      data:{ labels:["Lighting","Transport","Water"], datasets:[{ data:[50,30,20], backgroundColor:"#00f0ff" }] }
    });

    new Chart("weeklyChart", {
      type:"line",
      data:{ labels:["Morning","Rush","Night"], datasets:[{ data:[150,300,250], borderColor:"#00f0ff" }] }
    });

    new Chart("pieChart", {
      type:"bar",
      data:{ labels:["Normal","Festival"], datasets:[{ data:[200,400], backgroundColor:"#00f0ff" }] }
    });
  }
}