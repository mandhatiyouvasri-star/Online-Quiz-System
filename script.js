let questions = [];
let index = 0;
let score = 0;
let currentUser = "";
let time = 30;
let timer;

// SIGNUP
function signup(){
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({user:user.value, pass:pass.value});
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account Created!");
}

// LOGIN
function login(){
    let users = JSON.parse(localStorage.getItem("users")) || [];

    let found = users.find(u => u.user===user.value && u.pass===pass.value);

    if(found){
        currentUser = user.value;

        if(currentUser === "teacher"){
            teacher.classList.remove("hidden");
        } else {
            student.classList.remove("hidden");
            loadQuiz();
        }

        auth.classList.add("hidden");
    } else {
        alert("Login Failed!");
    }
}

// ADD QUESTION
function addQuestion(){
    let qobj = {
        question:q.value,
        a:a.value,b:b.value,c:c.value,d:d.value,
        correct:correct.value
    };

    questions.push(qobj);
    localStorage.setItem("questions", JSON.stringify(questions));
    alert("Added!");
}

// AI QUESTIONS
function generateAI(){
    let sample=[
        {question:"2+2?",a:"3",b:"4",c:"5",d:"6",correct:"b"},
        {question:"Capital of India?",a:"Delhi",b:"Mumbai",c:"Chennai",d:"Kolkata",correct:"a"}
    ];

    questions = questions.concat(sample);
    localStorage.setItem("questions", JSON.stringify(questions));
    alert("AI Questions Added!");
}

// LOAD QUIZ
function loadQuiz(){
    questions = JSON.parse(localStorage.getItem("questions")) || [];
    show();
    startTimer();
}

// SHOW
function show(){
    let q=questions[index];
    quiz.innerHTML=`
    <h3>${q.question}</h3>
    <input type="radio" name="ans" value="a">${q.a}<br>
    <input type="radio" name="ans" value="b">${q.b}<br>
    <input type="radio" name="ans" value="c">${q.c}<br>
    <input type="radio" name="ans" value="d">${q.d}
    `;
}

// NEXT
function next(){
    let ans=document.querySelector('input[name="ans"]:checked');

    if(ans && ans.value===questions[index].correct){
        score++;
    }

    index++;

    if(index<questions.length){
        show();
    } else {
        submit();
    }
}

// TIMER
function startTimer(){
    timer=setInterval(()=>{
        time--;
        document.getElementById("time").innerText=time;

        if(time===0){
            submit();
        }
    },1000);
}

// SUBMIT
function submit(){
    clearInterval(timer);

    let results = JSON.parse(localStorage.getItem("results")) || [];

    results.push({name:currentUser,score:score});
    localStorage.setItem("results", JSON.stringify(results));

    scoreDisplay();
    leaderboardLoad();
}

// SCORE
function scoreDisplay(){
    let total=questions.length;
    let percent=(score/total)*100;

    document.getElementById("score").innerText="Score: "+score+"/"+total;

    document.getElementById("dashboard").classList.remove("hidden");
    finalScore.innerText="Score: "+score;
    percentage.innerText="Percentage: "+percent+"%";
}

// LEADERBOARD
function leaderboardLoad(){
    let data = JSON.parse(localStorage.getItem("results")) || [];

    data.sort((a,b)=>b.score-a.score);

    let list="";
    let names=[],scores=[];

    data.forEach((r,i)=>{
        let cls="";
        if(i===0) cls="gold";
        else if(i===1) cls="silver";
        else if(i===2) cls="bronze";

        list += `<li class="${cls}">${i+1}. ${r.name} - ${r.score}</li>`;

        names.push(r.name);
        scores.push(r.score);
    });

    leaderboard.innerHTML=list;

    // GRAPH
    new Chart(document.getElementById("chart"), {
        type:'bar',
        data:{
            labels:names,
            datasets:[{label:"Scores",data:scores}]
        }
    });
}

// VIEW RESULTS (Teacher)
function viewResults(){
    leaderboardLoad();
}