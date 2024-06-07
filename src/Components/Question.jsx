import Radio from "./Radio";

export default function Question(props) {
    function handleChange(e) {
        const { id } = e.target;
        props.setUserAnswers((prevState) => {
            return prevState.map(obj => {
                return obj.questionID === props.questionData.questionID ? {...obj, userAnswerID: id} : obj;
            })
        })
    }

    const answerElements = props.questionData.allAnswers.map((element) => {
        return (
            <Radio 
                key={element.answerID} 
                answerID={element.answerID} 
                questionID={props.questionData.questionID} 
                value={element.answer} 
                handleChange={handleChange} 
                userAnswers={props.userAnswers} 
                results={props.results}
            />
        )
    })

    return (
      <div className="question">
        <h1 className="question--title">{props.questionData.question}</h1>
        <div className="question--form">
            {answerElements}
        </div>
        <hr></hr>
      </div>
    );
}