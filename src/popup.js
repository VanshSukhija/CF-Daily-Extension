let cal = document.getElementById('potdCalendar')
let output = document.getElementById('output')
let probstats = [];
let probs = [];
let probind = 0;
let Rprobstats = [];
let Rprobs = [];
let Rprobind = 0;
let userrating = 800;
let username = "Enter";

chrome.storage.local.get("rating", function (res) {
    userrating = res.rating;
});
chrome.storage.local.get("name", function (res) {
    username = res.name;
});

window.onload = async () => {
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
}

cal.addEventListener('change', async () => {
    output.innerHTML = `Loading...`
    let today = new Date();
    let date = today.getDate();
    if (date < 10)
        date = '0' + date
    let month = today.getMonth() + 1;
    if (month < 10)
        month = '0' + month;
    let year = today.getFullYear();
    today = year + '-' + month + '-' + date;

    if (cal.value > today)
        output.innerHTML = "You do have a time machine, don't you?"
    else {
        date = parseInt(cal.value.split('-')[2])
        month = parseInt(cal.value.split('-')[1])
        year = parseInt(cal.value.split('-')[0])
        probind = (year + month * date + 1709) % probs.length
        Rprobind = (year + month * date + 1709) % Rprobs.length

        output.innerHTML = `
        <div class="ques">
                <div>POTD-G</div>
                <a href="https://codeforces.com/problemset/problem/${probs[probind].contestId}/${probs[probind].index}" target="_blank">${probs[probind].name}</a>
        </div>`
        if (username != "Enter") {
            output.innerHTML += `
            <div class="ques">
                <div>POTD-R</div>
                <a href="https://codeforces.com/problemset/problem/${Rprobs[Rprobind].contestId}/${Rprobs[Rprobind].index}" target="_blank">${Rprobs[Rprobind].name}</a>
            </div>`
        }
    }
})