import Flashcard from "./Flashcard";

function Flashcards({ flashcards, setFlashcardStatus, setFlashcardImage }) {
  const flashcardsList = flashcards.map((flashcard, idx) => (
    <Flashcard
      key={flashcard.question}
      flashcard={flashcard}
      setFlashcardStatus={(...args) => setFlashcardStatus(idx, ...args)}
      setFlashcardImage={(...args) => setFlashcardImage(idx, ...args)}
    />
  ));

  return <>{flashcardsList}</>;
}

export default Flashcards;
