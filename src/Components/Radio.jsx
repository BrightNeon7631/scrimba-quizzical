export default function Radio(props) {
    function resultsColors() {
        if (props.results) {
            if (props.userAnswers.correctAnswerID === props.answerID) {
                return 'green';
            } else if ((props.userAnswers.userAnswerID === props.answerID) && (props.userAnswers.userAnswerID !== props.userAnswers.correctAnswerID)) {
                return 'red';
            } else {
                return 'grey';
            }
        } else {
            return '';
        }
    }

    return (
        <div className="radio--container">
         <input 
            type="radio" 
            value={props.value} 
            name={`question-${props.questionID}`} 
            id={props.answerID} 
            onChange={props.handleChange} 
            disabled={props.results}
         />
        <label 
            htmlFor={props.answerID} 
            className={`${resultsColors()}`}
        >
            {props.value}
        </label>
      </div>
    )
}