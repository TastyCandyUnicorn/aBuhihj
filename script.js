function tableGenerator(){
    const procNum = parseInt(document.getElementById('input1').value);
    const container1 = document.getElementById('output1');
    document.getElementById('output2').innerHTML = '';
    container1.innerHTML = '';
    
    if(isNaN(procNum) || procNum < 1){
        container1.innerHTML = '<p style="color:red">Invalid number of processes</p>';
        return;
    }
    
    let tableHTML = `
    <table class="t1">
        <thead>
            <tr>
                <th>ProcessId</th>
                <th>BurstTime</th>
            </tr>
        </thead>
        <tbody>
    `;
    for(let i = 0; i < procNum; i++){
        tableHTML += `
            <tr>
                <td><input type="number" min="1" id="pid${i+1}" value="${i+1}"></td>
                <td><input type="number" min="1" id="bt${i+1}"></td>
            </tr>
        `;
    }
    tableHTML += `
            </tbody>
        </table>
        <div class="d4">
            <button class="b1" onclick="sheduler()">Analysis</button>
        </div>
        `;
    container1.innerHTML = tableHTML;
}

function sheduler(){
    const procNum = parseInt(document.getElementById('input1').value);
    const container1 = document.getElementById('output2');
    container1.innerHTML = '';

    const bt = new Int16Array(procNum);
    const pid = new Int16Array(procNum);
    
    for(let i = 0; i < procNum; i++){
        bt[i] = parseInt(document.getElementById(`bt${i+1}`).value) || 0;
        pid[i] = parseInt(document.getElementById(`pid${i+1}`).value) || 0;
    }
    for(let i = 0; i < procNum - 1; i++){
        for(let j = i + 1; j < procNum; j++){
            if(bt[i] > bt[j]){
                let k = bt[i];
                let l = pid[i];
                bt[i] = bt[j];
                bt[j] = k;
                pid[i] = pid[j];
                pid[j] = l;
            }
        }
    }
    
    const wt = new Int16Array(procNum);
    const tat = new Int16Array(procNum);

    let tableHTML = `
    <table class="t2">
        <thead>
            <tr>
                <th>PID</th>
                <th>Burst Time</th>
                <th>Waiting Time</th>
                <th>TurnAround Time</th>
            </tr>
        </thead>
        <tbody>
    `;
    
    let ganttBlocksHTML = '';
    let currentTime = 0;

    for(let i = 0; i < procNum; i++){
        if(i === 0){
            wt[0] = 0;
            tat[0] = bt[0];
        } else {
            wt[i] = tat[i-1];
            tat[i] = wt[i] + bt[i];
        }
        
        currentTime += bt[i]; 

        tableHTML += `
            <tr>
                <td>P${pid[i]}</td>
                <td>${bt[i]}</td>
                <td>${wt[i]}</td>
                <td>${tat[i]}</td>
            </tr>
        `;

        let blockWidth = bt[i] * 30;
        ganttBlocksHTML += `
            <div class="gantt-box" style="width: ${blockWidth}px;">
                P${pid[i]}
                ${i === 0 ? '<span class="time-stamp start-zero">0</span>' : ''}
                <span class="time-stamp end-time">${currentTime}</span>
            </div>
        `;
    }
    
    tableHTML += `</tbody></table>`;
    
    let chartHTML = `
    <div class="gantt-container">
        <h3>Gantt Chart (100px Height)</h3>
        <div class="gantt-row">
            ${ganttBlocksHTML}
        </div>
    </div>
    `;
    
    container1.innerHTML = tableHTML + chartHTML;
}
