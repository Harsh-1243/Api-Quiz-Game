window.addEventListener("load", () => {

    const btn = document.querySelector("button");
    const CategorySelect = document.querySelector(".select-category");
    const QuestionSelect = document.querySelector(".select-question");
    const DifficultySelect = document.querySelector(".select-difficulty");
    const QuestionNo = document.querySelector("#question-no h1");
    const QuestionPara = document.querySelector("#question p");
    const Answer_Cont = document.querySelector("#answers");
    const part_1 = document.querySelector(".part-1");
    const part_2 = document.querySelector(".part-2");
    const PlayAgain = document.querySelector(".play-again button");

    let CurrentQuestionsSet = [];
    let CurrentQuestionIndex = 0;
    let TotalRightAns = 0;

    function FetchInitialData() {

        part_2.style.display = "none";

        let BaseUrl = "https://opentdb.com/api_category.php";

        fetch(BaseUrl).then(FetchInitialData_res => {

            FetchInitialData_res.json().then(FetchInitialData_json => {

                FetchInitialData_json.trivia_categories.forEach(ele => {

                    let option = document.createElement("option");

                    option.value = ele.id;

                    option.innerHTML = ele.name;

                    CategorySelect.appendChild(option);

                });

            }).catch((FetchInitialData_json_err) => {

                console.log("FetchInitialData Json error:- ", FetchInitialData_json_err);

            })

        }).catch((FetchInitialData_res_err) => {

            console.log("FetchInitialData response error:- ", FetchInitialData_res_err);

        })
    }

    function Shuffle(arr) {

        for (let i = arr.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements

        }

        return arr;

    }

    function CheckAnswer(isCorrect, UserBtn) {

        if (isCorrect) {

            TotalRightAns++;
            UserBtn.style.backgroundColor = "green";
            UserBtn.classList.add("text-white");
            console.log("correct");

        } else {

            console.log('wrong');
            UserBtn.style.backgroundColor = "red";
            UserBtn.classList.add("text-white");


            let correctBtn = Answer_Cont.querySelector("button[data-answer=correct]");
            if (correctBtn) {
                correctBtn.style.backgroundColor = "green";
                correctBtn.classList.add("text-white");
            }

        }

        CurrentQuestionIndex++;


        if (CurrentQuestionIndex < QuestionSelect.value) {

            setTimeout(AddQuestion, 2000);

        } else {

            setTimeout(() => {


                QuestionPara.textContent = `Correct Answers: ${TotalRightAns} / ${QuestionSelect.value}`;
                Answer_Cont.innerHTML = '';
                QuestionNo.innerHTML = "";

                PlayAgain.style.display = "block";

            }, 1000);



        }

    }

    function AddQuestion() {

        let currentQuestion = CurrentQuestionsSet[CurrentQuestionIndex];

        QuestionNo.innerHTML = `Question: ${CurrentQuestionIndex + 1} / ${QuestionSelect.value}`;

        QuestionPara.innerHTML = currentQuestion.question;

        let AllAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];

        let ShuffledAnswers = Shuffle(AllAnswers);

        Answer_Cont.innerHTML = "";

        ShuffledAnswers.forEach((val) => {

            let btn = document.createElement("button");

            btn.innerHTML = val;

            btn.classList.add("answer-btn", "p-3", "btn", "btn-outline-warning", "text-black", "rounded-pill");

            if (val === currentQuestion.correct_answer) {

                btn.dataset.answer = "correct";

            }

            btn.addEventListener("click", () => {

                CheckAnswer(val === currentQuestion.correct_answer, btn);

            })

            Answer_Cont.appendChild(btn);

        });
    }

    function DisplayQuestions() {

        part_1.style.display = "none";

        part_2.style.display = "block";

        PlayAgain.style.display = "none";

        AddQuestion();

    }

    function FetchQuestions(Category, Question, Difficulty) {

        let QuestionUrl = `https://opentdb.com/api.php?amount=${Question}`;

        if (Category) {

            QuestionUrl += `&category=${Category}`;

        }

        if (Difficulty) {

            QuestionUrl += `&difficulty=${Difficulty}`;

        }

        QuestionUrl += `&type=multiple`;


        fetch(QuestionUrl).then((FetchQuestions_res) => {

            FetchQuestions_res.json().then((FetchQuestions_json) => {

                CurrentQuestionsSet = FetchQuestions_json.results;

                DisplayQuestions();


            }).catch((FetchQuestions_json_err) => {

                console.log("FetchQuestions json error", FetchQuestions_json_err);

            })

        }).catch((FetchQuestions_res_err) => {

            console.log("FetchQuestions respoonse error", FetchQuestions_res_err);

        })



    }


    function StartGame() {

        const CategoryVal = CategorySelect.value;
        const QuestionVal = QuestionSelect.value;
        const DifficultyVal = DifficultySelect.value;

        FetchQuestions(CategoryVal, QuestionVal, DifficultyVal);

    }



    btn.addEventListener("click", StartGame);

    PlayAgain.addEventListener("click", () => {

        location.reload();

    });

    FetchInitialData();

})

