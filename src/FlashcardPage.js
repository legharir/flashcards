import { useEffect, useState } from "react";
import Flashcards from "./Flashcards";
import styled from "styled-components";
import { useParams } from "react-router-dom";

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function getImageBlobs(rtfData) {
  let hexImages = [];
  let curIdx = 0;
  while (curIdx < rtfData.length) {
    const blipuidIdx = rtfData.indexOf("blipuid", curIdx);
    if (blipuidIdx === -1) break;

    const hexImgStartIdx = rtfData.indexOf("}", blipuidIdx);
    const hexImgEndIdx = rtfData.indexOf("}", hexImgStartIdx + 1);
    const hexImg = rtfData.substring(hexImgStartIdx + 1, hexImgEndIdx);

    hexImages.push(hexImg.trim());
    curIdx = hexImgEndIdx + 1;
  }

  // for some reason only every even indexed hex image is valid.
  return hexImages
    .filter((_, idx) => idx % 2 === 0)
    .map((hexImage) => {
      const imgByteArray = hexStringToByteArray(hexImage);
      return new Blob([imgByteArray], {
        type: "application/octet-stream",
      });
    });
}

function blobTodataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function hexStringToByteArray(hexString) {
  const cleanedHexString = hexString.replace(/[^A-Fa-f0-9]/g, "");
  let bytes = [];

  for (let i = 0; i < cleanedHexString.length / 2; i++) {
    let byte = cleanedHexString.substr(i * 2, 2);
    bytes[i] = parseInt(byte, 16);
  }
  return new Uint8Array(bytes);
}

const Container = styled.div`
  margin: 2em;
`;

const Horizontal = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Clickable = styled.span`
  cursor: pointer;
`;

const AttemptBadge = styled.span`
  margin: 0.2em;
`;

function FlashcardPage() {
  const { deckName } = useParams();

  const [flashcards, setFlashcards] = useState(
    JSON.parse(localStorage.getItem(deckName)) ?? []
  );

  const textContainsImage = (text) => {
    if (text === " ") return true;
    const startsWithWhitespace = /^\s/.test(text);
    const endsWithWhitespace = /\s$/.test(text);
    return Boolean(startsWithWhitespace ^ endsWithWhitespace);
  };

  const createFlashcards = (textData, imageUrls) => {
    textData = textData.split(/\t|\r\n|\n/);
    const newFlashCards = [];

    for (let i = 0; i < textData.length - 1; i = i + 2) {
      const question = textData[i];
      const answer = textData[i + 1];

      newFlashCards.push({
        question,
        answer,
        questionImageUrl: textContainsImage(question) ? imageUrls.shift() : "",
        answerImageUrl: textContainsImage(answer) ? imageUrls.shift() : "",
        status: "unattempted",
        showAnswer: false,
        attempts: [],
      });
    }

    if (imageUrls.length > 0) {
      console.error("Something strange happened...");
      console.log(textData);
      console.log(imageUrls);
    }
    return newFlashCards;
  };

  useEffect(() => {
    async function handlePaste(e) {
      if (
        flashcards.length > 0 &&
        !window.confirm(
          "WAIT! Are you sure you want to replace the current flashcards with the ones you copied?"
        )
      ) {
        return;
      }
      const textData = e.clipboardData.getData("text");
      const rtfData = e.clipboardData.getData("text/rtf");
      const imageBlobs = getImageBlobs(rtfData);

      const imageUrls = [];
      for (const imageBlob of imageBlobs) {
        imageUrls.push(await blobTodataUrl(imageBlob));
      }

      const newFlashcards = createFlashcards(textData, imageUrls);
      setFlashcards(newFlashcards);
    }

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [flashcards.length]);

  useEffect(() => {
    localStorage.setItem(deckName, JSON.stringify(flashcards));
  }, [deckName, flashcards]);

  const setShowAnswer = (flashcardIndex, showAnswer) => {
    const updatedFlashcards = flashcards.map((flashcard, idx) =>
      idx !== flashcardIndex ? flashcard : { ...flashcard, showAnswer }
    );
    setFlashcards(updatedFlashcards);
  };

  const setFlashcardStatus = (flashcardIndex, status) => {
    const updatedFlashcards = flashcards.map((flashcard, idx) =>
      idx !== flashcardIndex
        ? flashcard
        : {
            ...flashcard,
            status,
            attempts:
              status === "unattempted" ? [] : [...flashcard.attempts, status],
          }
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

  const sortFlashcardsByAttempt = (attempt) => {
    const getNumAttempts = (flashcard) =>
      flashcard.attempts.reduce((acc, cur) => {
        if (cur === attempt) {
          return acc + 1;
        }
        return acc;
      }, 0);

    const updatedFlashcards = [...flashcards].sort(
      (a, b) => getNumAttempts(b) - getNumAttempts(a)
    );
    setFlashcards(updatedFlashcards);
  };

  const handleShowHideAllFlashcardAnswers = (showFlashcardAnswers) => {
    setFlashcards(
      flashcards.map((flashcard) => ({
        ...flashcard,
        showAnswer: showFlashcardAnswers,
      }))
    );
  };

  const shuffleFlashcards = () => {
    setFlashcards(shuffle([...flashcards]));
  };

  const addFlaschardsFromClipboard = async () => {
    const pasteData = await navigator.clipboard.readText();
    const flashcardsToAdd = createFlashcards(pasteData);
    setFlashcards((flashcards) => [...flashcards, ...flashcardsToAdd]);
  };

  const deleteFlashcard = (flashcardIndex) => {
    setFlashcards(flashcards.filter((_, idx) => idx !== flashcardIndex));
  };

  return (
    <Container>
      <Horizontal>
        <div>
          Sort:
          <Clickable onClick={() => sortFlashcards("correct")}>✔️</Clickable>
          <Clickable onClick={() => sortFlashcards("incorrect")}>❌</Clickable>
          <Clickable onClick={() => sortFlashcards("unattempted")}>
            🔄
          </Clickable>
        </div>
        <div>
          Sort:
          <Clickable onClick={() => sortFlashcardsByAttempt("correct")}>
            <AttemptBadge className="badge badge-success">correct</AttemptBadge>
          </Clickable>
          <Clickable onClick={() => sortFlashcardsByAttempt("incorrect")}>
            <AttemptBadge className="badge badge-danger">
              incorrect
            </AttemptBadge>
          </Clickable>
        </div>
        <button
          onClick={() => shuffleFlashcards()}
          className="btn btn-primary btn-sm"
        >
          Shuffle
        </button>
        <div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleShowHideAllFlashcardAnswers(true)}
          >
            Show Answers
          </button>{" "}
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleShowHideAllFlashcardAnswers(false)}
          >
            Hide Answers
          </button>
        </div>
        <div>
          Attempted:{" "}
          {flashcards.reduce(
            (acc, cur) => (cur.attempts.length > 0 ? acc + 1 : acc),
            0
          )}{" "}
          Unattempted:{" "}
          {flashcards.reduce(
            (acc, cur) => (cur.attempts.length > 0 ? acc : acc + 1),
            0
          )}{" "}
          Total: {flashcards.length}{" "}
        </div>
      </Horizontal>
      <Flashcards
        flashcards={flashcards}
        setShowAnswer={setShowAnswer}
        setFlashcardStatus={setFlashcardStatus}
        deleteFlashcard={deleteFlashcard}
      />
      <button
        className="btn btn-primary btn-small"
        onClick={addFlaschardsFromClipboard}
      >
        Add flashcards from clipboard
      </button>
    </Container>
  );
}

export default FlashcardPage;
