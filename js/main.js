//Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector('.answers-area');
let submitButton = document.querySelector('.submit-button')
let bullets =document.querySelector(".submit-button")
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector('.countdown')
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
function getQuestion(){
    let myRequest = new XMLHttpRequest();
    
    myRequest.onreadystatechange = function () {
        if( this.readyState == 4 && this.status == 200){
            let questionsObject = JSON.parse(this.responseText);
            let qCount = questionsObject.length;
            
            //create Bullets + Set Questions count
            createBullets(qCount);
            //create Question title and Question answer
            addQuestionData( questionsObject[currentIndex], qCount);


            //countdown
            countdown(10, qCount)
            //Click on submit
            submitButton.onclick = ()=>{
                //Get Right Answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                
                //INcrease Index 
                currentIndex++;
                //check The Answer
                checkAnswer(theRightAnswer, qCount)

                //Remove previous Question
                quizArea.innerHTML ="";
                answersArea.innerHTML= "";
                //create another Question title and Question answer
                addQuestionData( questionsObject[currentIndex], qCount);
                //Handle Bullets class
                handleBullets();
                //show Results 
                showResults(qCount);
                
                 //countdown
                clearInterval(countdownInterval)
                countdown(10, qCount)

            }

        }
    }
    myRequest.open("GET","html_questions.json" , true);
    myRequest.send()
}
getQuestion()

function createBullets(num){
    countSpan.innerHTML = num;
    //create Spans
    for(let i = 0; i< num; i++){
        //Create Bullet
        let theBullet = document.createElement("span");
        //check if its first span
        if(i === 0){
            theBullet.className = "on"
        }
        // Append Bullets To Main Bullet Container
        bulletsSpanContainer.appendChild(theBullet)
    }
}

//add Question Data
function addQuestionData( obj, count){
    if(currentIndex < count){
        //create h2 questions title
    let questionTitle = document.createElement("h2");

    //create question text
    let questionText = document.createTextNode(obj.title);

    //Append text to H2
    questionTitle.appendChild(questionText);
    //Append the H2 to QuizArea
    quizArea.appendChild(questionTitle)
    //create the answers 
    for(let i = 1 ; i <= 4 ; i++){
        //create main answer div
        let mainDiv = document.createElement("div");
        //Add class to div 
        mainDiv.className = "answer"
        //create radio input
        let radioInput = document.createElement("input")
        // Add Type , Name , Id , Data_attribute
        radioInput.name = 'questions';
        radioInput.type = 'radio';
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];
        
        //make first Option Selected
        if(i === 1){
            radioInput.checked =true;
        }

        //create label 
        let theLabel = document.createElement("label");
        //add for attribute 
        theLabel.htmlFor = `answer_${i}`;

        //create label text
        let theLabelText = document.createTextNode(obj[`answer_${i}`]);
        //add the text to the label
        theLabel.appendChild(theLabelText);
        //add input , label to Main Div => answer
        mainDiv.appendChild(radioInput)
        mainDiv.appendChild(theLabel)

        //Append All Divs to answers area
        answersArea.appendChild(mainDiv)
    }
    }
}

function checkAnswer(rAnswer , count){
    let answers = document.getElementsByName("questions");
    let theChoosenAnswer ;
    for(let i = 0; i<answers.length; i++){
        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if(rAnswer === theChoosenAnswer){
        rightAnswers++;
    }


}
function handleBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayofSpans = Array.from(bulletsSpans);
    arrayofSpans.forEach( (span, index) =>{
        if(currentIndex === index){
            span.className = 'on';
        }
    })
}

function showResults(count){
    let theResults ;
    if( currentIndex === count){
        quizArea.remove();
        answersArea.remove()
        submitButton.remove();
        bullets.remove();
        bulletsSpanContainer.remove();
        
        if(rightAnswers > (count / 2 ) && rightAnswers <count){
            theResults = `<span class="good"> Good</span> ${rightAnswers} from ${count}.`
        }else if(rightAnswers === count){
            theResults = `<span class="perfect">Perfect </span> ${rightAnswers} from ${count}.`;
        }else{
            theResults = `<span class="bad">Bad </span> ${rightAnswers} from ${count}.`;
        }
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "10px";
    }
}
function countdown(duration, count){
    if(currentIndex < count){
        let minutes, seconds;
        countdownInterval = setInterval( function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes= minutes < 10 ? `0${minutes}`: minutes;
            seconds = seconds < 10 ? `0${seconds}`:seconds;
            countdownElement.innerHTML = ` ${minutes}:${seconds}`
            if(--duration < 0){
                clearInterval(countdownInterval)
                submitButton.click();
            }
        },1000)
    }
}




