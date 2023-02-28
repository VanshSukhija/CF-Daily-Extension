let table = document.getElementsByClassName('problems')[0].childNodes[1]
let row = table.childNodes[2]
let str = row.innerHTML
let data1 = row.childNodes[1]
let data2 = row.childNodes[3]
let data3 = row.childNodes[5]
let data4 = row.childNodes[7]
let data5 = row.childNodes[9]

let username = document.getElementsByClassName('lang-chooser')[0].childNodes[3].childNodes[1].innerText

let probstats = [];
let probs = [];
let probind = 0;
async function getData() {
    await fetch(`https://codeforces.com/api/problemset.problems`)
    .then(response => response.json())
    .then(data => {
        for (let i = 0; i < data.result.problems.length; i++) {
            if (('rating' in data.result.problems[i]) && data.result.problems[i].rating <= 2000 && data.result.problems[i].rating >= 1000) {
                probstats.push(data.result.problemStatistics[i]);
                probs.push(data.result.problems[i])
            }
        }
    })
    .catch(err => console.log(err))
    
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    // probind = (year*month + date + 1709) % probs.length
    probind = (2023*2 + 28 + 1708) % probs.length

    let row1 = table.insertRow(1);
    let cell1 = row1.insertCell(0);
    let cell2 = row1.insertCell(1);
    let cell3 = row1.insertCell(2);
    let cell4 = row1.insertCell(3);
    let cell5 = row1.insertCell(4);
    cell1.innerHTML = data1.innerHTML
    cell2.innerHTML = data2.innerHTML
    cell3.innerHTML = data3.innerHTML
    cell4.innerHTML = data4.innerHTML
    cell5.innerHTML = data5.innerHTML
    
    row1.childNodes[0].innerHTML = `<a href="/problemset/problem/${probs[probind].contestId}/${probs[probind].index}">POTD</a>`
    
    row1.childNodes[1].childNodes[1].innerHTML = `<a href="/problemset/problem/${probs[probind].contestId}/${probs[probind].index}">${probs[probind].name}</a>`
    
    row1.childNodes[1].childNodes[3].innerHTML = "";
    for (let i = 0; i < probs[probind].tags.length; i++) {
        let taglink = probs[probind].tags[i].replaceAll(' ', '+');
    
        row1.childNodes[1].childNodes[3].innerHTML += `<a href="/problemset?tags=${taglink}" style="text-decoration: none;" class="notice">${probs[probind].tags[i]}</a>`
    
        if (i != probs[probind].tags.length - 1)
            row1.childNodes[1].childNodes[3].innerHTML += ", "
    }
    
    row1.childNodes[2].childNodes[1].innerHTML = `<a href="/problemset/submit/${probs[probind].contestId}/${probs[probind].index}"><img src="https://codeforces.org/s/47998/images/icons/submit-22x22.png" title="Submit" alt="Submit"></a>`
    
    row1.childNodes[3].innerHTML = `<span title="Difficulty" class="ProblemRating">${probs[probind].rating}</span>`
    
    row1.childNodes[4].innerHTML = `<a title="Participants solved the problem" href="/problemset/status/${probs[probind].contestId}/problem/${probs[probind].index}" style="font-size: 1.1rem"><img style="vertical-align:middle;" src="https://codeforces.org/s/47998/images/icons/user.png">&nbsp;x${probstats[probind].solvedCount}</a>`

    getProbStatus();
}
getData();

async function getProbStatus(){
    await fetch(`https://codeforces.com/api/user.status?handle=${username}`)
    .then(response => response.json())
    .then(data => {
        let flag = 0;
        for(let i=0; i<data.result.length; i++){
            if(data.result[i].problem.contestId == probs[probind].contestId && data.result[i].problem.index == probs[probind].index){
                if(data.result[i].verdict == "OK")
                    flag = 1;
                else
                    flag = -1;
                break;
            }
        }
        if(flag == 1){
            document.getElementsByClassName('problems')[0].childNodes[1].childNodes[2].classList.add('accepted');
        }
        else if(flag == -1){
            document.getElementsByClassName('problems')[0].childNodes[1].childNodes[2].classList.add('rejected');
        }
    })
    .catch(err => console.log(err));
}