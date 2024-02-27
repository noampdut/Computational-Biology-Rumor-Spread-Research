//todo: ask if the person cant spread rumor due to generation limit, can the skep change ?
//todo: ask if person allready got rumor and pass L gens can spread? even if other niegbor didnt tells him
var size_table = 100
var P = 10000 //number of people
var L = 3 //generations

var skeptizem = [0,1/3,2/3,1]

var precentage = [0.4,0.4,0.1,0.1]
//var colors = ['red', '#ff00e8' ,'blue' ,'#19ffa8']
var colors = ['black', 'darkgray',  'lightgray', 'white', "#19ffa8"]

var data = []

var flag = "rumor"

var counter = 0

var Ex2Flag = 0

var precentage = 0

var got_rumor = 0;

var stop = false; //condition for stopping the simulation

var gotRomurEachGeneration = [] 
var generation = []

function PopUpGraph(arr1, arr2) {
   

// Open a new window
var newWindow = window.open("", "GraphWindow", "width=600,height=400");

// Write the canvas element to the new window
newWindow.document.write("<canvas id='myChart'></canvas>");

// Create the chart on the canvas element in the new window
var ctx = newWindow.document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: arr1,
    datasets: [{
      label: 'Spread of Rumor',
      data: arr2,
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderWidth: 1
    }]
  },
  options: {
    title: {
      display: true,
      text: 'Rumor Spread by Generation'
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Presence of Rumor Spread'
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Generation'
        }
      }]
    }
  }
});

chart.update();
}

function getPersonIndexByPosition(col, row){
    let res = null
    data.forEach(p => {
        if(p.col === col && p.row === row){
            res = p
        }
    });
    return res
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startSimulation() {
    init()
    const counterEl = document.getElementById('counter');
    
    while (!stop) {
        // increment the counter
        counter++;
        // update the counter display
        counterEl.textContent = counter;
        precentage = got_rumor / P
        gotRomurEachGeneration.push(precentage)
        generation.push(counter)
       // addData(counter,precentage)
        nextGen()
        await sleep(250); // wait for 1/2 second 
       
    }
    counterEl.textContent = counter + " - STOPPED";
    console.log(counter)
    console.log(precentage)
    counter = 0;
    PopUpGraph(generation,gotRomurEachGeneration)
}

function getParams(){
    const radioGroup = document.getElementsByName("option");
    let selectedValue;
  
    for (let i = 0; i < radioGroup.length; i++) {
      if (radioGroup[i].checked) {
        selectedValue = radioGroup[i].value;
        break;
      }
    }

    flag = selectedValue
    /////////////////////////
    let skepPrec = []
    skepPrec.push(parseFloat(document.getElementById("s1").value))
    skepPrec.push(parseFloat(document.getElementById("s2").value))
    skepPrec.push(parseFloat(document.getElementById("s3").value))
    skepPrec.push(parseFloat(document.getElementById("s4").value))

    precentage = skepPrec

    ////////////////////////
    let p = parseInt(document.getElementById("numPeople").value)
    let l = parseInt(document.getElementById("numL").value)
    P = p
    L = l
}


function Ex2Click() {
    console.log("entert")
    Ex2Flag = 1;
    startSimulation();
    console.log("entert2")
    
}



function init(){
    getParams()
    // create table element
    var table = document.createElement('table');
    table.id = "board"
    // create rows and columns
    for (var i = 0; i < size_table; i++) {
        var row = table.insertRow();
        for (var j = 0; j < size_table; j++) {
            var cell = row.insertCell();
            cell.style.backgroundColor = "#19ffa8";
            
        }
    }

    if(Ex2Flag == 0) {
         // select 50 random cells to color red
        for(var i=0; i< 4; i++)
        {
            for (var k = 0; k < P*precentage[i]; k++) {
                var randomRow = Math.floor(Math.random() * size_table);
                var randomCol = Math.floor(Math.random() * size_table);
                
                while(getPersonIndexByPosition(randomCol, randomRow) != null){
                    randomRow = Math.floor(Math.random() * size_table);
                    randomCol = Math.floor(Math.random() * size_table);
                }

                table.rows[randomRow].cells[randomCol].style.backgroundColor = colors[i];
                var person = {originalSkep:i, row:randomRow, col: randomCol, skep: i, generation:0, spread:false, countSpread:0, alreadyHeardRomur: false}
                data.push(person)
            
            }
        }
    } else {

      
    for(var i = 0; i < 4; i++) {
        for (var k = 0; k < P * precentage[i]; k++) {
            var row, col;
            if (i == 0) {
                row = 25 + Math.floor(Math.random() * 46);
              } else if (i == 1) {
                row = Math.floor(Math.random() * 26) + 70;
              } else if (i == 2) {
                row = Math.floor(Math.random() * 11) + 80;
              } else {
                row = Math.floor(Math.random() * 25);
              }
            col = Math.floor(Math.random() * size_table);
            while(getPersonIndexByPosition(col, row) != null){
                row = Math.floor(Math.random() * size_table);
                col = Math.floor(Math.random() * size_table);
            }

            table.rows[row].cells[col].style.backgroundColor = colors[i];
            var person = {originalSkep: i, row: row, col: col, skep: i, generation: 0, spread: false, countSpread: 0, alreadyHeardRomur: false}
            data.push(person)
        }
    }
}

    
   

    var divSimulation = document.createElement('div');
    divSimulation.id = "divSimulation"
    document.body.appendChild(divSimulation);
    
    var divBtn = document.createElement('div');
    divBtn.classList.add("centered-container")
    //divBtn.innerHTML = "<button id='btnNext' onclick='nextGen()'>next generation</button>"
    divBtn.innerHTML = "<button id='btnStop'>stop</button>"
    divBtn.innerHTML += "<p> Generation Number: <span id='counter'>0</span></p>"
    divBtn.innerHTML += "<p> Precentage: <span id='prec'></span></p>"
    divBtn.innerHTML = "<button id='btnStop'>stop</button>"
    divBtn.innerHTML += "<p style='margin-left: 20px;'>Generation Number: <span id='counter'>0</span></p>"
    divBtn.innerHTML += "<p style='margin-left: 20px;'>Precentage: <span id='prec'></span></p>"


    divSimulation.appendChild(divBtn);

    var divTable = document.createElement('div');
    divTable.appendChild(table);

    divSimulation.appendChild(divTable);

    
   
    //cant choose first person to be with skeptizem = 0, because then the rumor spread is stac

   var randomPerson = Math.floor(Math.random() * P);
   console.log(randomPerson)
   while(skeptizem[data[randomPerson].skep] === 0){
     randomPerson = Math.floor(Math.random() * P);
   }
    
    data[randomPerson].spread = true

    stop = false
    document.getElementById('btnStop').addEventListener('click', function() {
        stop = true;
        precentage = got_rumor / P
        console.log(got_rumor)
        const precEl = document.getElementById('prec');
        precEl.textContent = precentage;
        console.log(generation)
        console.log(gotRomurEachGeneration)
    
    });

    
}




function endSimulation(){
    const divElement = document.getElementById("divSimulation");

    while (divElement.firstChild) {
      divElement.removeChild(divElement.firstChild);
    }
  
    divElement.remove();
    data = []
    generation = []
    precentage = []
    gotRomurEachGeneration = []
    got_rumor = 0
    counter = 0    
    Ex2Flag = 0
    
}

 function nextGen(){

    data.forEach(person => {
    
        if(person.spread){

            var currRow = person.row
            var currCol = person.col

            //if i heared the rumor- color me
            /*if(flag === "rumor")
            {
                let table = document.getElementById('board')
                table.rows[currRow].cells[currCol].style.backgroundColor = 'red';
            }*/

            if(person.generation >= L){
                if(passOrNot(skeptizem[person.skep])){
                    if(flag === "rumor")
                    {
                        let table = document.getElementById('board')
                        table.rows[currRow].cells[currCol].style.backgroundColor = 'red';
                    }
                    //right
                    getRumor(currCol+1 , currRow)
                    //left
                    getRumor(currCol-1, currRow)
                    //up
                    getRumor(currCol, currRow +1)
                    //down
                    getRumor(currCol, currRow -1)
                    //right-top
                    getRumor(currCol+1, currRow+1)
                    //right-down
                    getRumor(currCol+1, currRow-1)
                    //left-top
                    getRumor(currCol-1, currRow+1)
                    //left-down
                    getRumor(currCol-1, currRow-1)

                    person.spread = false
                   // got_rumor +=1
                    
                }

                if(person.generation >= L){
                    person.generation = 0 
                    //init the skep to the original
                    person.skep = person.originalSkep
                }
                
            }

            person.generation += 1
            //person.spread = false
            //in comment because if allready got the rumor and couls spread it then after L gens can try again
            //person.spread = false
        }
        
        
    });
    //check countSpread for all neighbors and change color and skep acoordingly
    data.forEach(person => {
        if(person.generation >= L && person.countSpread >= 2 && person.skep + 1 < 4){
            //person.skep = (person.skep + 1) % skeptizem.length
            person.skep = (person.skep + 1)
            
            let row = person.row
            let col = person.col
            if(flag === "skep")
            //if(skep === "rumor")
            {
                let table = document.getElementById('board')
                table.rows[row].cells[col].style.backgroundColor = colors[person.skep];
            }
        }
        
        //init the countSpread to 0
        person.countSpread = 0
    })
    
    
}

function passOrNot(skep){
    if (Math.random() < skep) {
        return true
    }
   // console.log(skep + "f")
    return false 
}

function getRumor(col, row){
    if(col < size_table && row < size_table){
        let person = getPersonIndexByPosition(col,row)
        if(person != null){
            person.countSpread += 1
            person.spread = true
           // person.alreadyHeardRomur = true

            if(person.alreadyHeardRomur == false) {
                got_rumor += 1
                person.alreadyHeardRomur = true
            }
            
            
        }
      
    }
}




function endSimulation(){
    const divElement = document.getElementById("divSimulation");

    while (divElement.firstChild) {
      divElement.removeChild(divElement.firstChild);
    }
  
    divElement.remove();
    data = []
    generation = []
    precentage = []
    gotRomurEachGeneration = []
    got_rumor = 0
    counter = 0    
    

}

//create the notes section when the page is loaded
var ids = ["s4-rec","s3-rec","s2-rec","s1-rec","empty"]

for(let i = 0; i<colors.length;i++){

    var c = document.getElementById(ids[i])
    var ctx = c.getContext("2d");
    ctx.rect(0, 0, 10, 10);
    ctx.fillStyle = colors[i];
    ctx.fill();
}

