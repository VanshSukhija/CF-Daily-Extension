let cal = document.getElementById('potdCalendar')
let output = document.getElementById('output')
let probstats = [];
let probs = [];
let probind = 0;

cal.addEventListener('change', async () => {
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

        date = parseInt(cal.value.split('-')[2])
        month = parseInt(cal.value.split('-')[1])
        year = parseInt(cal.value.split('-')[0])
        probind = (year + month * date + 1709) % probs.length

        // yha output ki innerHTML me anchor tag dedete h with problem name as the link
        output.innerHTML = `<a href="https://codeforces.com/problemset/problem/${probs[probind].contestId}/${probs[probind].index}" target="_blank">${probs[probind].name}</a>`
    }
})