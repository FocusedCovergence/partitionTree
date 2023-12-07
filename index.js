async function init() {
}

init()

//calculate the partition function
function generatePartitions2(n) {
    var partitions = [[n]];
    var tempPartition = [];
    while(partitions[partitions.length-1][0] > 1){
        var lastPartition = partitions.pop();
        tempPartition.push(lastPartition);
        while(partitions.length > 0 && partitions[partitions.length-1][0] == lastPartition[0]){
            lastPartition = partitions.pop();
            tempPartition.push(lastPartition);
        }

        for(i = tempPartition.length - 1; i >= 0; i--){
            partitions.push(tempPartition[i]);
        }
        // for(i = 0; i < tempPartition.length ; i++){
        //     partitions.push(tempPartition[i]);
        // }

        for(j = tempPartition.length - 1; j >= 0; j--){
            lastPartition = tempPartition[j];
            if(lastPartition[0] - 1 >= lastPartition[1] || lastPartition.length == 1){
                var currentNumber = lastPartition[0] - 1;
                for(i = 0; i <= lastPartition.length; i++){
                    var nextPartition = [];
                    if(i == lastPartition.length){
                        if(lastPartition.length == 1 || currentNumber >= lastPartition[1]){
                            nextPartition = Array.from(lastPartition);
                            nextPartition[0] = currentNumber;
                            nextPartition.push(1);
                        }
                    }else if(lastPartition[i] + 1 <= lastPartition[i-1] && i != 1){
                        nextPartition = Array.from(lastPartition);
                        nextPartition[0] = currentNumber;
                        nextPartition[i] = nextPartition[i] + 1;
                    }else if(i == 1 && lastPartition[i] + 1 <= currentNumber){
                        nextPartition = Array.from(lastPartition);
                        nextPartition[0] = currentNumber;
                        nextPartition[i] = nextPartition[i] + 1;
                    }

                    var judge = true;
                    for(k = 0; k < partitions.length; k++){
                        if(checkArrayEqual(partitions[k],nextPartition)){
                            judge = false;
                        }
                    }
                    if(nextPartition.length > 0 && judge){
                        partitions.push(nextPartition);
                    }
                }
            }
        }
        tempPartition = [];
    }
    return(partitions);
}

//compare two arrays, used in generating partitions
function checkArrayEqual(arr1, arr2){
    var result = true;
    if (arr1.length != arr2.length){
        result = false;
    }
    else {
        for (let i = 0; i < arr1.length; i++){
            if (arr1[i] != arr2[i]){
                result = false;
            }
        }
    }
    return result;
}


function generateAndDisplayPartitions() {
    const userInput = document.getElementById('userInput').value;
    const number = parseInt(userInput);

    if (number > 0 && number <= 30) {
        document.getElementById("overviewButton").style.display = "inline-block"
        document.getElementById("selectByPartitionButton").style.display = "inline-block"

        const waitingMessage = document.getElementById("waitingMessage");
        waitingMessage.style.display = "block";
        const partitions = generatePartitions2(number);
        if(partitions.length > 0){
            drawDiagram(partitions, number);
            drawCheckDiagram(partitions,number);
            listAllPartitions(partitions)
        }
        const partitionsDisplay = document.getElementById('displayValue');
        const summaryDisplay = document.getElementById('displaySummary');
        summaryDisplay.innerHTML = `<p>There are total ` + partitions.length +` Partitions of ${number}:</p><ul>`;
        partitionsDisplay.innerHTML = ``;
        partitions.forEach((partition,index) => {
            partitionsDisplay.innerHTML += `<li id="p${index+1}" class="options">${partition.join(' + ')}</li>`;
        });

        partitionsDisplay.innerHTML += `</ul>`;

        document.getElementById("slider-container").style.display = "inline-block"

        const checkboxContainer = document.getElementById('checkboxContainer');
        const checkboxIntro = document.getElementById('checkboxIntro');
        checkboxIntro.innerHTML = `<p>Check from ` + partitions.length +` Partitions of number ${number} below :</p><ul>`;
        checkboxContainer.innerHTML = ``;
        partitions.forEach((partition, index) => {
            const li = document.createElement('li');
            li.id = `pcheck${index + 1}`;
            li.className = 'options';
            li.innerHTML = partition.join(' + ');
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `checkbox_${index + 1}`;
            checkbox.value = `partition_${index + 1}`;
            checkbox.checked = true;
            li.insertBefore(checkbox, li.firstChild);
    
            const label = document.createElement('label');
            label.htmlFor = `checkbox_${index + 1}`;
            label.appendChild(document.createTextNode(partition.join(' + ')));
    
            checkboxContainer.appendChild(li);
        });

        const checkboxes = document.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function(event) {
                const checkboxId = event.target.id.substring(("checkbox_").length);
                // console.log(checkboxId);
                const targetElements = document.querySelectorAll(`.sp${checkboxId}`);
                if (event.target.checked) {
                    console.log(`Checkbox ${event.target.id} is checked`);
                    console.log(targetElements);
                    targetElements.forEach(element => {
                        element.style.display = 'block';
                    });
                } else {
                    console.log(`Checkbox ${event.target.id} is unchecked`);
                    targetElements.forEach(element => {
                        element.style.display = 'none';
                    });
                }
                });
        });
        waitingMessage.style.display = "none";
    }
        else {
        alert('Please enter a valid natural number under 100.');
    }
}


//draw overview
function drawDiagram(partitions, number){
    const canvas = document.getElementById("showDiagram")
    canvas.innerHTML = '';
    const margin = {
        bottom: 50,
        left: 0
    },
    width = 1800,
    height = 1000;

    const svg = d3
        .select("#showDiagram")
        .append("svg")
        .attr("id", "diagramSquares")
        .attr("width", width)
        .attr("height", height);
  
    var countPartition = partitions.length;
    var colorGap = 320/countPartition;
    var sideTotal = 800/(number);
    var sideLen = sideTotal*5/6;
    var sideGap = (sideTotal/6)/countPartition;
    for (i = partitions.length - 1; i >= 0; i--) {
        var currentPartition = partitions[i];
        for (j = currentPartition.length - 1; j >= 0; j--) {
            for (k = currentPartition[j] - 1; k >= 0; k--) {
                svg.append('rect')
                    // .attr('x', 600 + j * (sideTotal) + i * sideGap)
                    .attr('x', 500 + j * (sideTotal) + i * sideGap)
                    .attr('y', 800 - (k + 1) * sideTotal - i * sideGap)
                    .attr('width', sideLen)
                    .attr('height', sideLen)
                    .attr('stroke', 'black')
                    // .attr('fill', `hsl(${30 + i * colorGap}, 100%, 50%)`)
                    .attr('fill', `hsl(${30 + i * colorGap}, ${(i%2 + 1) * 50}%, 50%)`)
                    .attr('class', `p${i + 1}`);
            }
        }
    }
    var className = []
    for(i = 0; i < partitions.length; i++){
        className.push(`p${i + 1}`)
    }
    className.forEach(classSelector => {
        svg.selectAll(`.${classSelector}`)
            .on('mouseover', function () {
                const selectedClass = classSelector;
                mouseover(svg, selectedClass,partitions);
                for(i = 1; i < parseInt(selectedClass.substring(1)); i++){
                    var elementsFront = d3.selectAll(`.shallowfront${i}`);
                    explodeViewFront(elementsFront,i,selectedClass);
                }
                for(i = parseInt(selectedClass.substring(1)) + 1; i < partitions.length + 1; i++){
                    var elementsBack = d3.selectAll(`.shallowback${i}`);
                    explodeViewBack(elementsBack,i,selectedClass);
                }

            })
            .on('mouseout', function () {
                // svg.selectAll('rect').classed('shallow', false);
                mouseout(svg);
                resetPos(svg)
            });
    });

}



function compareClass(className, selectedClass){
    var classNumber = parseInt(className.substring(1));
    var selectedNum = parseInt(selectedClass.substring(1));
    return classNumber < selectedNum;
}

function mouseover(svg, selectedClass,partitions){

    svg.selectAll('rect')
        .each(function(){
            var rect = d3.select(this);
            var className = rect.attr("class");

            if (className === selectedClass) {
                const textToShow = partitions[parseInt(selectedClass.substring(1)) - 1].join('+');
                rect.append("title")
                    .text(textToShow);
                updatePartitionText(partitions[parseInt(selectedClass.substring(1)) - 1])
            }

            if(className !== selectedClass){
                if (compareClass(className, selectedClass)) {
                    rect.classed(`shallowfront${className.substring(1)}`, true); 
                }else{
                    rect.classed(`shallowback${className.substring(1)}`, true); 
                }
            }
        })
}

function mouseout(svg) {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
    svg.selectAll('rect')
        .each(function() {
            var rect = d3.select(this);
            var className = rect.attr("class");
            rect.classed(`shallowfront${className.substring(1)}`, false);
            rect.classed(`shallowback${className.substring(1)}`, false);
            updatePartitionText([]);
        });
        
}


function getShiftValue(){
    var shiftSlider = document.getElementById("ovewviewSlider")
    var shiftValue = shiftSlider.value;
    return(shiftValue);
}

function explodeViewFront(elementsFront,i,selectedClass){
    var range = getShiftValue();
    var shiftBonus = parseInt(selectedClass.substring(1)) - i
    elementsFront.each(function() {
        d3.select(this)
            .transition()
            .duration(2000)
            .attr('transform', `translate(${-range*shiftBonus}, ${range*shiftBonus})`)
            .style('opacity', 0.1);
    });

}

function explodeViewBack(elementsFront,i,selectedClass){
    var range = getShiftValue();
    var shiftBonus = i - parseInt(selectedClass.substring(1))
    elementsFront.each(function() {
        d3.select(this)
            .transition()
            .duration(2000)
            .attr('transform', `translate(${range*shiftBonus}, ${-range*shiftBonus})`)
            .style('opacity', 0.1);
    });

}

//reset the position of blocks
function resetPos(svg){
    svg.selectAll('rect')
    .transition()
    .duration(2000)
    .attr('transform', 'translate(0, 0)')
    .style('opacity',1.0);
}

//show tooltip besides mouse
function showClassNameTooltip(className, event) {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'block';
    tooltip.style.left = event.pageX + 'px';
    tooltip.style.top = event.pageY + 'px';
    tooltip.textContent = className;
}

//update the partition on the page
function updatePartitionText(partitions) {
    const currentPartition = document.getElementById('currentPartition');
    const combinedText = 'Current chosen partition is: ' + partitions.join('+');
    currentPartition.textContent = combinedText;

}

function showShowDiagram() {
    document.getElementById('overviewClass').style.display = 'block';
    document.getElementById('showDiagram').style.display = 'grid';
    document.getElementById('selectByPartitionClass').style.display = "none";
    document.getElementById('selectByPartition').style.display = "none";
    document.getElementById('listAllPart').style.display = 'none';
    document.getElementById('listAll').style.display = 'none';
    document.getElementById('currentPartition').style.display = 'block';
    // document.getElementById('slider-container').style.display = 'inline-block';
}

function showSelectByPartition() {
    document.getElementById('overviewClass').style.display = 'none';
    document.getElementById('showDiagram').style.display = 'none';
    document.getElementById('selectByPartitionClass').style.display = 'block';
    document.getElementById('selectByPartition').style.display = "block";
    document.getElementById('listAllPart').style.display = 'none';
    document.getElementById('listAll').style.display = 'none';
    document.getElementById('currentPartition').style.display = 'none';
    // document.getElementById('slider-container').style.display = 'none';
}

function showlistAll() {
    document.getElementById('overviewClass').style.display = "none";
    document.getElementById('showDiagram').style.display = "none";
    document.getElementById('selectByPartitionClass').style.display = "none";
    document.getElementById('selectByPartition').style.display = "none";
    document.getElementById('listAllPart').style.display = 'block';
    document.getElementById('listAll').style.display = 'block';
    document.getElementById('currentPartition').style.display = 'none';
    // document.getElementById('slider-container').style.display = 'none';
}


var selectButton = document.getElementById('selectByPartitionButton');
selectButton.addEventListener('click', showSelectByPartition);

var overviewButton = document.getElementById('overviewButton');
overviewButton.addEventListener('click', showShowDiagram);

var listAllButton = document.getElementById('listAllButton');
listAllButton.addEventListener('click', showlistAll);
  
function drawCheckDiagram(partitions,number){
    const canvas = document.getElementById("selectByPartition")
    canvas.innerHTML = '';
    const margin = {
        bottom: 50,
        left: 0
    },
    width = 1800,
    height = 1000;

    const svg = d3
        .select("#selectByPartition")
        .append("svg")
        .attr("id", "selectDiagramSquares")
        .attr("width", width)
        .attr("height", height);
  
    var countPartition = partitions.length;
    var colorGap = 320/countPartition;
    var sideTotal = 800/(number);
    var sideLen = sideTotal*5/6;
    var sideGap = (sideTotal/6)/countPartition;
    for (i = partitions.length - 1; i >= 0; i--) {
        var currentPartition = partitions[i];
        for (j = currentPartition.length - 1; j >= 0; j--) {
            for (k = currentPartition[j] - 1; k >= 0; k--) {
                svg.append('rect')
                    .attr('x', 500 + j * (sideTotal) + i * sideGap)
                    .attr('y', 800 - (k + 1) * sideTotal - i * sideGap)
                    // .attr('y', 800 - (k + 1) * sideLen )
                    .attr('width', sideLen)
                    .attr('height', sideLen)
                    .attr('stroke', 'black')
                    // .attr('fill', `hsl(${30 + i * colorGap}, 100%, 50%)`)
                    .attr('fill', `hsl(${30 + i * colorGap}, ${(i%2 + 1) * 50}%, 50%)`)
                    .attr('class', `sp${i + 1}`);
            }
        }
    }
}

const slider = document.getElementById('ovewviewSlider');
const sliderValueSpan = document.getElementById('sliderValue');

slider.addEventListener('input', function() {
    const value = this.value;
    // console.log('Slider value:', value);
    sliderValueSpan.textContent = value + "%";
});

document.getElementById('checkAllButton').addEventListener('click', function() {
    // Get all checkboxes within the checkbox container
    const checkboxes = document.querySelectorAll('#checkboxContainer input[type="checkbox"]');
    
    // Check all checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
        const checkboxId = checkbox.id.substring(("checkbox_").length);
        const targetElements = document.querySelectorAll(`.sp${checkboxId}`);
        targetElements.forEach(element => {
            element.style.display = 'block';
        });

    });

});

document.getElementById('uncheckAllButton').addEventListener('click', function() {
    // Get all checkboxes within the checkbox container
    const checkboxes = document.querySelectorAll('#checkboxContainer input[type="checkbox"]');
    
    // Check all checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        const checkboxId = checkbox.id.substring(("checkbox_").length);
        const targetElements = document.querySelectorAll(`.sp${checkboxId}`);
        targetElements.forEach(element => {
            element.style.display = 'none';
        });

    });

});

function listAllPartitions(partitions){
    var data = partitions;
    const canvas = document.getElementById("listAll")
    canvas.innerHTML = '';
    const margin = {
        bottom: 50,
        left: 0
    },
    width = 1000,
    height = 1000;

    const svg = d3
        .select("#listAll")
        .append("svg")
        .attr("id", "listAllContainer")
        .attr("width", width)
        .attr("height", height);
  
    
    const groups = svg.selectAll(null)
        .data(data)
        .enter().append("g")
        .attr("class", "graph")
        .attr("width", 200) // Width of each square
        .attr("height", 200) // Height of each square
        .attr("transform", (d, i) => `translate(${(i%4) * 200}, ${Math.floor(i/4)*200})`); // Adjust group spacing
      
    var loop = 0;
    // console.log("This is " + data.length)
    var totalPartitions = data.length;
    var svgContainer = d3.select("#listAllContainer");
    svgContainer.attr("height", Math.ceil(totalPartitions/4 + 1)*200)
    groups.each(function (d, i) {
        const graph = d3.select(this);
        let count = 0;
        let sign = 0;
        let summationOfi = d3.sum(d);
        let range = 200/summationOfi;
        console.log(summationOfi);
        // let innerArrayLen = d.length;
        var colorGap = 320/totalPartitions;
        // console.log(innerArrayLen);
        // let xRange = 200/innerArrayLen;
        d.forEach(val => {
            for (let j = 0; j < val; j++) {
                graph.append("rect")
                    .attr("x", sign * range)
                    .attr("y", 200-j * range)
                    .attr("width", range*5/6)
                    .attr("height", range*5/6)
                    .attr("fill", `hsl(${30 + loop * colorGap}, ${(loop%2 + 1) * 50}%, 50%)`);
                count = count+1;
            }

            sign++;
        });
        graph.append("text")
            .attr("x", 0)
            .attr("y", 200 + range*2 )
            .style("font-size", `${range/1.33}px`)
            .text(d.join("+"));
        loop = loop+1;
    });


}
