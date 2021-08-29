import Flashcards from './Flashcards'

const fla = [
  {question: "Who is the fattest person on earh", answer: "yo momma"},
  {question: "Who is the second fattest person on earh", answer: "yo momma's momma"}
]

function App() {
  return (
    <div>
      <Flashcards flashcards={fla}/>
    </div>
  )
}

export default App;
