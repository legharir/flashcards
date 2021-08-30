import { useEffect, useState } from "react";
import Flashcards from "./Flashcards";

function App() {
  const [flashcards, setFlashcards] = useState(
    JSON.parse(localStorage.getItem("flashcards")) ?? []
  );

  const createFlashcards = (pasteData) => {
    pasteData = pasteData.split(/\t|\r\n|\n/);
    const newFlashCards = [];

    for (let i = 0; i < pasteData.length - 1; i = i + 2) {
      if (pasteData[i] !== "" && pasteData[i + 1] !== "") {
        newFlashCards.push({
          question: pasteData[i],
          answer: pasteData[i + 1],
          status: "unattempted",
        });
      }
    }

    setFlashcards(newFlashCards);
  };

  useEffect(() => {
    document.addEventListener("paste", (e) => {
      if (
        flashcards.length > 0 &&
        window.confirm(
          "WAIT! Are you sure you want to replace the current flashcards with the ones you copied?"
        )
      ) {
        const pasteData = e.clipboardData.getData("text");
        createFlashcards(pasteData);
      }
    });

    return () => {
      document.removeEventListener("paste");
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  const setFlashcardStatus = (flashcardIndex, status) => {
    const updatedFlashcards = flashcards.map((flashcard, idx) =>
      idx !== flashcardIndex ? flashcard : { ...flashcard, status }
    );
    setFlashcards(updatedFlashcards);
  };

  const setFlashcardImage = (flashcardIndex, isForQuestion, imageUrl) => {
    const contentsToUpdate = {};
    if (isForQuestion) {
      contentsToUpdate.questionImageUrl = imageUrl;
    } else {
      contentsToUpdate.answerImageUrl = imageUrl;
    }

    const updatedFlashcards = flashcards.map((flashcard, idx) =>
      idx !== flashcardIndex ? flashcard : { ...flashcard, ...contentsToUpdate }
    );
    setFlashcards(updatedFlashcards);
  };

  return (
    <>
      <Flashcards
        flashcards={flashcards}
        setFlashcardStatus={setFlashcardStatus}
        setFlashcardImage={setFlashcardImage}
      />
    </>
  );
}

export default App;
