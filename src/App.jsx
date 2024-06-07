import Question from './Components/Question';
import StartPage from './Components/StartPage';
import { decode } from 'html-entities';
import { v4 as uuidv4 } from 'uuid';
import { 
  useEffect,
  useState 
} from 'react';

function App() {
  const [apiData, setApiData] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [results, setResults] = useState(false);

  const [newQuiz, setNewQuiz] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startPage, setStartPage] = useState(true);

  useEffect(() => {
    async function getQuestions() {
      try {
        setFetchError(false);
        setLoading(true);
        const res = await fetch(
          'https://opentdb.com/api.php?amount=5&category=15&type=multiple'
        );
        if (!res.ok) {
          const msg = `There was an error: ${res.status} ${res.statusText}`;
          throw new Error(msg);
        }
        const data = await res.json();
        setApiData(data.results);
      } catch (error) {
        setFetchError('There was an error. Try refreshing the page.');
      } finally {
        setLoading(false);
      }
    }

    if (newQuiz) {
      getQuestions();
      setNewQuiz(false);
    }
  }, [newQuiz]);

  useEffect(() => {
    if (apiData.length > 0) {
      setQuestionsData(generateQuestionsArray(apiData));
    }
  }, [apiData])

  useEffect(() => {
    if (questionsData.length > 0) {
      setUserAnswers(generateUserChoiceArray(questionsData));
    }
  }, [questionsData])

  function generateQuestionsArray(data) {
    const questionsArray = [];
    data.forEach((element, index) => {
      const answersArray = [...element.incorrect_answers, element.correct_answer];

      const newAnswersArray = answersArray.map((element) => {
        return {
          answerID: uuidv4(),
          answer: decode(element, { level: 'html5' })
        }
      })

      questionsArray.push({
        questionID: index,
        question: decode(element.question, { level: 'html5' }),
        allAnswers: fisherYates(newAnswersArray),
        correctAnswerData: newAnswersArray.find(arrayElement => arrayElement.answer === decode(element.correct_answer, { level: 'html5' }))
      })
    })
    
    return questionsArray;
  }

  function generateUserChoiceArray(questionsData) {
    const userArray = questionsData.map((question) => {
      if (question !== undefined) {
        return { questionID: question.questionID, correctAnswerID: question.correctAnswerData.answerID, userAnswerID: '' }
      }
    })
    
    return userArray;
  }

  const fisherYates = (toShuffle = []) => {
    for (let i = (toShuffle.length - 1); i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [toShuffle[i], toShuffle[randomIndex]] = [toShuffle[randomIndex], toShuffle[i]];
    }
    
    return toShuffle;
  };

  const questionElements = questionsData && userAnswers ? questionsData.map((question) => {
    if (question !== undefined) {
      return (
        <Question 
          key={question.questionID} 
          questionData={question}
          setUserAnswers={setUserAnswers}
          userAnswers={userAnswers.find(element => element.questionID === question.questionID)} // userAnswer data for one question
          results={results}
        />
      )
    }
  }) : null

  function checkAnswers() {
    if (!results) {
      const newArray = [];
      userAnswers.forEach((element) => {
        element.userAnswerID === element.correctAnswerID ? newArray.push({ isCorrect: true }) : newArray.push({ isCorrect: false })
      })
      setResults(newArray);
    } else {
      setResults(false);
      setUserAnswers([]);
      setNewQuiz(true);
    }
  }

  return (
    <main>
      <div className='blob--1'></div>
      <div className='blob--2'></div>
      {startPage ? <StartPage handleStartPageClick={() => setStartPage(false)} /> : null}
      {!startPage ? 
      <>
        {fetchError ? <div className='error'>{fetchError}</div> : null}
        {!loading ? questionElements : <div className='loading'>loading data from the API...</div>}
        <div className={`results--container ${results ? 'results--container--check' : ''}`}>
          {results ? <div className='results'>You scored {results.filter(result => result.isCorrect === true).length} / {results.length} correct answers</div> : null}
          {userAnswers ? <button onClick={checkAnswers}>{results ? 'Play again' : 'Check answers'}</button> : null}
        </div>
      </> : null}
    </main>
  )
}

export default App