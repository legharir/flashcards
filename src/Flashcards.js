import Flashcard from "./Flashcard";

function Flashcards({
  flashcards,
  setShowAnswer,
  setFlashcardStatus,
  deleteFlashcard,
}) {
  const flashcardsList = flashcards.map((flashcard, idx) => (
    <Flashcard
      key={flashcard.question + idx}
      flashcard={flashcard}
      setShowAnswer={(...args) => setShowAnswer(idx, ...args)}
      setFlashcardStatus={(...args) => setFlashcardStatus(idx, ...args)}
      deleteFlashcard={(...args) => deleteFlashcard(idx, ...args)}
    />
  ));

  return <>{flashcardsList}</>;
}

export default Flashcards;
