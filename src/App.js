import { useState } from "react";
import Flashcards from "./Flashcards";

function App() {
  const [flashcards, setFlashcards] = useState([]);

  const createFlashcards = (pasteData) => {
    pasteData = pasteData.split(/\t|\r\n|\n/);
    const newFlashCards = [];

    for (let i = 0; i < pasteData.length - 1; i = i + 2) {
      if (pasteData[i] !== "" && pasteData[i + 1] !== "") {
        newFlashCards.push({
          question: pasteData[i],
          answer: pasteData[i + 1],
        });
      }
    }

    setFlashcards(newFlashCards);
  };

  document.addEventListener("paste", (e) => {
    const pasteData = (e.clipboardData || window.clipboardData).getData("text");
    createFlashcards(pasteData);
  });

  return (
    <>
      <Flashcards flashcards={flashcards} />
    </>
  );
}

export default App;
