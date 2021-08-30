import Flashcard from "./Flashcard";

function Flashcards({ flashcards, updateFlashcardStatus }) {
  const flashcardsList = flashcards.map((flashcard, idx) => (
    <Flashcard
      key={flashcard.question}
      flashcard={flashcard}
      updateFlashcardStatus={(...args) => updateFlashcardStatus(idx, ...args)}
    />
  ));

  return <>{flashcardsList}</>;
}

export default Flashcards;
