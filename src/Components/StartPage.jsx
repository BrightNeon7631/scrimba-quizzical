export default function StartPage(props) {
    return (
        <div className="start--page">
            <h1 className="start--page--title">Quizzical</h1>
            <div className="start--page--description">Video Game Quiz</div>
            <button 
                onClick={props.handleStartPageClick} 
                className="start--page--button"
            >
                Start quiz
            </button>
        </div>
    )
}