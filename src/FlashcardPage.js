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
  max-height: 93vh;
  display: flex;
  flex-direction: column;
`;

const Horizontal = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Vertical = styled.div`
  overflow: none;
  display: flex;
  flex-direction: column;
`;

const Clickable = styled.span`
  cursor: pointer;
`;

const AttemptBadge = styled.span`
  margin: 0.2em;
`;

const Breather = styled.span`
  margin-left: 1em;
  margin-right: 1em;
  white-space: nowrap;
`;

const FlaschardsContainer = styled.div`
  overflow: auto;
`;

const SortOptions = styled.div`
  display: flex;
  flex-direction: column;
`;

const DeleteAllButton = styled.div`
  justify-self: flex-end;
`;

function FlashcardPage() {
  const { deckName } = useParams();

  const [flashcards, setFlashcards] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    const req = indexedDB.open("flashcards", 1);

    req.onerror = (e) => {
      console.error(
        "Could not open connection to database, error code: ",
        e.target.errorCode
      );
    };

    req.onsuccess = (e) => {
      const db = e.target.result;
      db.onerror = (e) => console.error(e.target.errorCode);
      setDb(db);

      const transaction = db.transaction("decks");
      const objectStore = transaction.objectStore("decks");
      const request = objectStore.get(deckName);
      request.onsuccess = (e) => {
        setFlashcards(request.result?.flashcards ?? []);
      };
    };

    req.onupgradeneeded = (e) => {
      console.log("Performing DB migration...");
      const db = e.target.result;
      db.createObjectStore("decks", { keyPath: "name" });
    };
  }, [deckName]);

  useEffect(() => {
    async function handlePaste(e) {
      if (
        flashcards.length > 0 &&
        !window.confirm("Add flashcards from clipboard?")
      ) {
        return;
      }

      addFlashcardsFromClipboardData(e.clipboardData);
    }

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [flashcards.length]);

  useEffect(() => {
    if (db) {
      const transaction = db.transaction("decks", "readwrite");
      const objectStore = transaction.objectStore("decks");
      objectStore.put({ name: deckName, flashcards });
    }
  }, [db, deckName, flashcards]);

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

  async function addFlashcardsFromClipboardData(clipboardData) {
    const textData = clipboardData.getData("text");
    const rtfData = clipboardData.getData("text/rtf");
    const imageBlobs = getImageBlobs(rtfData);

    const imageUrls = [];
    for (const imageBlob of imageBlobs) {
      imageUrls.push(await blobTodataUrl(imageBlob));
    }

    const flashcardsToAdd = createFlashcards(textData, imageUrls);
    setFlashcards((flashcards) => [...flashcards, ...flashcardsToAdd]);
  }

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

  const deleteFlashcard = (flashcardIndex) => {
    setFlashcards(flashcards.filter((_, idx) => idx !== flashcardIndex));
  };

  const deleteFlashcards = () => {
    if (
      window.confirm("Are you sure you want to delete all your flashcards?")
    ) {
      setFlashcards([]);
    }
  };

  return (
    <Container>
      {flashcards.length > 0 ? (
        <Horizontal>
          <div>
            Sort:
            <SortOptions>
              <div>
                <Clickable onClick={() => sortFlashcards("correct")}>
                  ??????
                </Clickable>
                <Clickable onClick={() => sortFlashcards("incorrect")}>
                  ???
                </Clickable>
                <Clickable onClick={() => sortFlashcards("unattempted")}>
                  ????
                </Clickable>
              </div>
              <div>
                <Clickable onClick={() => sortFlashcardsByAttempt("correct")}>
                  <AttemptBadge className="badge badge-success">
                    # correct
                  </AttemptBadge>
                </Clickable>
                <Clickable onClick={() => sortFlashcardsByAttempt("incorrect")}>
                  <AttemptBadge className="badge badge-danger">
                    # incorrect
                  </AttemptBadge>
                </Clickable>
              </div>
            </SortOptions>
          </div>
          <div>
            <button
              style={{ maxHeight: "50%" }}
              onClick={() => shuffleFlashcards()}
              className="btn btn-secondary btn-sm"
            >
              Shuffle
            </button>
          </div>
          <div className="btn-group">
            <button
              style={{ maxHeight: "50%" }}
              className="btn btn-secondary btn-sm"
              onClick={() => handleShowHideAllFlashcardAnswers(true)}
            >
              Show Answers
            </button>{" "}
            <button
              style={{ maxHeight: "50%" }}
              className="btn btn-secondary btn-sm"
              onClick={() => handleShowHideAllFlashcardAnswers(false)}
            >
              Hide Answers
            </button>
          </div>
          <Vertical>
            <Breather>
              Attempted:{" "}
              {
                <strong>
                  {flashcards.reduce(
                    (acc, cur) => (cur.attempts.length > 0 ? acc + 1 : acc),
                    0
                  )}
                </strong>
              }
            </Breather>
            <Breather>
              Unattempted:{" "}
              {
                <strong>
                  {flashcards.reduce(
                    (acc, cur) => (cur.attempts.length > 0 ? acc : acc + 1),
                    0
                  )}
                </strong>
              }
            </Breather>
            <Breather>Total: {<strong>{flashcards.length}</strong>}</Breather>
          </Vertical>
          <DeleteAllButton>
            <button
              className="btn btn-danger btn-small"
              onClick={deleteFlashcards}
            >
              Delete flashcards
            </button>
          </DeleteAllButton>
        </Horizontal>
      ) : (
        <div>
          <h2>Copy some data, then use ???+V to create flashcards.</h2>
        </div>
      )}
      <FlaschardsContainer>
        <Flashcards
          flashcards={flashcards}
          setShowAnswer={setShowAnswer}
          setFlashcardStatus={setFlashcardStatus}
          deleteFlashcard={deleteFlashcard}
        />
      </FlaschardsContainer>
    </Container>
  );
}

export default FlashcardPage;
