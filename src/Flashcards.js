import Flashcard from "./Flashcard";

function Flashcards({
  flashcards,
  setShowAnswer,
  setFlashcardStatus,
  setFlashcardImage,
}) {
  const flashcardsList = flashcards.map((flashcard, idx) => (
    <Flashcard
      key={flashcard.question}
      flashcard={flashcard}
      setShowAnswer={(...args) => setShowAnswer(idx, ...args)}
      setFlashcardStatus={(...args) => setFlashcardStatus(idx, ...args)}
      setFlashcardImage={(...args) => setFlashcardImage(idx, ...args)}
    />
  ));

  return <>{flashcardsList}</>;
}

export default Flashcards;
