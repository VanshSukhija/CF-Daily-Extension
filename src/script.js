if (!document.URL.includes('acmsguru')) {
    let table = document.getElementsByClassName('problems')[0].childNodes[1]
    let row = table.childNodes[2]
    let str = row.innerHTML
    let data1 = row.childNodes[1]
    let data2 = row.childNodes[3]
    let data3 = row.childNodes[5]
    let data4 = row.childNodes[7]
    let data5 = row.childNodes[9]

    let row1 = table.insertRow(1);
    let cell1 = row1.insertCell(0);
    let cell2 = row1.insertCell(1);
    let cell3 = row1.insertCell(2);
    let cell4 = row1.insertCell(3);
    let cell5 = row1.insertCell(4);

    cell1.innerText = 'POTD-G'
    cell2.innerText = 'Loading...'
    cell3.innerText = 'Loading...'
    cell4.innerText = 'Loading...'
    cell5.innerText = 'Loading...'
    
    let row2
    let Rcell1
    let Rcell2
    let Rcell3
    let Rcell4
    let Rcell5

    let username = document.getElementsByClassName('lang-chooser')[0].childNodes[3].childNodes[1].innerText
    chrome.storage.local.set({"name": username});
    if(username != "Enter"){
        row2 = table.insertRow(2);
        Rcell1 = row2.insertCell(0);
        Rcell2 = row2.insertCell(1);
        Rcell3 = row2.insertCell(2);
        Rcell4 = row2.insertCell(3);
        Rcell5 = row2.insertCell(4);
        
        Rcell1.innerText = 'POTD-R'
        Rcell2.innerText = 'Loading...'
        Rcell3.innerText = 'Loading...'
        Rcell4.innerText = 'Loading...'
        Rcell5.innerText = 'Loading...'
    }

    let userrating = 800;
    let probstats = [];
    let probs = [];
    let probind = 0;
    let Rprobstats = [];
    let Rprobs = [];
    let Rprobind = 0;

    async function getData() {
        await fetch(`https://codeforces.com/api/user.rating?handle=${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.result.length > 0)
                    userrating = Math.max(data.result[data.result.length - 1].newRating, userrating);
                userrating = 100*Math.round(userrating/100)
                chrome.storage.local.set({"rating": userrating});
            })

        await fetch(`https://codeforces.com/api/problemset.problems`)
            .then(response => response.json())
            .then(data => {
                let recentContestId = data.result.problems[0].contestId;
                for (let i = 0; i < data.result.problems.length; i++) {
                    if (('rating' in data.result.problems[i])) {
                        recentContestId = data.result.problems[i].contestId;
                        break;
                    }
                }

                for (let i = 0; i < data.result.problems.length && data.result.problems[i].contestId >= recentContestId - 750; i++) {
                    if (('rating' in data.result.problems[i]) && (data.result.problems[i].contestId >= recentContestId - 500) && (data.result.problems[i].contestId <= recentContestId - 100)) {
                        probstats.push(data.result.problemStatistics[i]);
                        probs.push(data.result.problems[i])
                    }
                    if ('rating' in data.result.problems[i] && Math.abs(data.result.problems[i].rating - userrating) <= 200) {
                        Rprobstats.push(data.result.problemStatistics[i]);
                        Rprobs.push(data.result.problems[i])
                    }
                }
            })
            .catch(err => console.log(err))

        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let date = today.getDate();
        probind = (year + month * date + 1709) % probs.length
        Rprobind = (year + month * date + 1709) % Rprobs.length

        cell1.innerHTML = data1.innerHTML
        cell2.innerHTML = data2.innerHTML
        cell3.innerHTML = data3.innerHTML
        cell4.innerHTML = data4.innerHTML
        cell5.innerHTML = data5.innerHTML

        cell1.innerHTML = `<a href="/problemset/problem/${probs[probind].contestId}/${probs[probind].index}">POTD-G</a>`

        cell2.childNodes[1].innerHTML = `<a href="/problemset/problem/${probs[probind].contestId}/${probs[probind].index}">${probs[probind].name}</a>`
        
        cell2.childNodes[3].innerHTML = "";
        for (let i = 0; i < probs[probind].tags.length; i++) {
            let taglink = probs[probind].tags[i].replaceAll(' ', '+');

            cell2.childNodes[3].innerHTML += `<a href="/problemset?tags=${taglink}" style="text-decoration: none;" class="notice">${probs[probind].tags[i]}</a>`
            
            if (i != probs[probind].tags.length - 1)
                cell2.childNodes[3].innerHTML += ", "
        }

        cell3.childNodes[1].innerHTML = `<a href="/problemset/submit/${probs[probind].contestId}/${probs[probind].index}"><img src="https://codeforces.org/s/47998/images/icons/submit-22x22.png" title="Submit" alt="Submit"></a>`

        cell3.removeChild(cell3.lastElementChild)
        
        cell4.innerHTML = `<span title="Difficulty" class="ProblemRating">${probs[probind].rating}</span>`
        
        cell5.innerHTML = `<a title="Participants solved the problem" href="/problemset/status/${probs[probind].contestId}/problem/${probs[probind].index}" style="font-size: 1.1rem"><img style="vertical-align:middle;" src="https://codeforces.org/s/47998/images/icons/user.png">&nbsp;x${probstats[probind].solvedCount}</a>`
        
        if(username != "Enter"){
            Rcell1.innerHTML = data1.innerHTML
            Rcell2.innerHTML = data2.innerHTML
            Rcell3.innerHTML = data3.innerHTML
            Rcell4.innerHTML = data4.innerHTML
            Rcell5.innerHTML = data5.innerHTML

            Rcell1.innerHTML = `<a href="/problemset/problem/${Rprobs[Rprobind].contestId}/${Rprobs[Rprobind].index}">POTD-R</a>`

            Rcell2.childNodes[1].innerHTML = `<a href="/problemset/problem/${Rprobs[Rprobind].contestId}/${Rprobs[Rprobind].index}">${Rprobs[Rprobind].name}</a>`

            Rcell2.childNodes[3].innerHTML = "";
            for (let i = 0; i < Rprobs[Rprobind].tags.length; i++) {
                let taglink = Rprobs[Rprobind].tags[i].replaceAll(' ', '+');
    
                Rcell2.childNodes[3].innerHTML += `<a href="/problemset?tags=${taglink}" style="text-decoration: none;" class="notice">${Rprobs[Rprobind].tags[i]}</a>`
    
                if (i != Rprobs[Rprobind].tags.length - 1)
                    Rcell2.childNodes[3].innerHTML += ", "
            }

            Rcell3.childNodes[1].innerHTML = `<a href="/problemset/submit/${Rprobs[Rprobind].contestId}/${Rprobs[Rprobind].index}"><img src="https://codeforces.org/s/47998/images/icons/submit-22x22.png" title="Submit" alt="Submit"></a>`
            Rcell3.removeChild(Rcell3.lastElementChild)

            Rcell4.innerHTML = `<span title="Difficulty" class="ProblemRating">${Rprobs[Rprobind].rating}</span>`

            Rcell5.innerHTML = `<a title="Participants solved the problem" href="/problemset/status/${Rprobs[Rprobind].contestId}/problem/${Rprobs[Rprobind].index}" style="font-size: 1.1rem"><img style="vertical-align:middle;" src="https://codeforces.org/s/47998/images/icons/user.png">&nbsp;x${Rprobstats[Rprobind].solvedCount}</a>`
        }
        
        getProbStatus();
    }
    getData();

    async function getProbStatus() {
        await fetch(`https://codeforces.com/api/user.status?handle=${username}`)
            .then(response => response.json())
            .then(data => {
                let flagG = 0, flagR = 0;
                for (let i = 0; i < data.result.length; i++) {
                    if (data.result[i].problem.contestId == probs[probind].contestId && data.result[i].problem.index == probs[probind].index) {
                        if (data.result[i].verdict == "OK") flagG = 1;
                        else flagG = -1;
                        break;
                    }
                    if (username != "Enter" && data.result[i].problem.contestId == Rprobs[Rprobind].contestId && data.result[i].problem.index == Rprobs[Rprobind].index) {
                        if (data.result[i].verdict == "OK") flagR = 1;
                        else flagR = -1;
                        break;
                    }
                }
                if (flagG == 1) {
                    row1.classList.add('accepted');
                } else if (flagG == -1) {
                    row1.classList.add('rejected');
                }
                if (flagR == 1) {
                    row2.classList.add('accepted');
                } else if (flagR == -1) {
                    row2.classList.add('rejected');
                }
            })
            .catch(err => console.log(err));
    }
}