import Flashcard from "./Flashcard";

function Flashcards({ flashcards }) {
  const flashcardsList = flashcards.map((flashcard) => (
    <Flashcard key={flashcard.question} flashcard={flashcard} />
  ));

  return <>{flashcardsList}</>;
}

export default Flashcards;
