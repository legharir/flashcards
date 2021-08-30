import { useEffect, useState } from "react";
import Flashcards from "./Flashcards";
import styled from "styled-components";

const Container = styled.div`
  margin: 2em;
`;

const Clickable = styled.span`
  cursor: pointer;
`;

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

  const sortFlashcards = (status) => {
    const updatedFlashcards = [...flashcards].sort((a, b) => {
      if (a.status === status && b.status !== status) return -1;
      else if (a.status !== status && b.status === status) return 1;
      return 0;
    });
    setFlashcards(updatedFlashcards);
  };

  return (
    <Container>
      <div>
        Sort:
        <Clickable onClick={() => sortFlashcards("correct")}>✔️</Clickable>
        <Clickable onClick={() => sortFlashcards("incorrect")}>❌</Clickable>
        <Clickable onClick={() => sortFlashcards("unattempted")}>🔄</Clickable>
      </div>
      <Flashcards
        flashcards={flashcards}
        setFlashcardStatus={setFlashcardStatus}
        setFlashcardImage={setFlashcardImage}
      />
    </Container>
  );
}

export default App;
