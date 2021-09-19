import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 1em;
`;

function DeckPage({ decks, setDecks }) {
  const [newDeckName, setNewDeckName] = useState("");
  const [newDeckCreated, setNewDeckCreated] = useState(false);

  const createNewDeck = () => {
    setDecks([...decks, newDeckName]);
    setNewDeckCreated(true);
  };

  const onDeleteDeck = (deckName) => {
    if (
      !window.confirm(`Are you sure you wish to delete the ${deckName} deck?`)
    ) {
      return;
    }

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

      const transaction = db.transaction("decks", "readwrite");
      const objectStore = transaction.objectStore("decks");
      const request = objectStore.delete(deckName);
      request.onsuccess = (e) => {
        setDecks(decks.filter((deck) => deck !== deckName));
      };
    };

    req.onupgradeneeded = (e) => {
      console.log("Performing DB migration...");
      const db = e.target.result;
      db.createObjectStore("decks", { keyPath: "name" });
    };
  };

  return (
    <Container>
      {newDeckCreated && <Redirect to={`/deck/${newDeckName}`} />}

      {decks.map((deck) => (
        <div style={{ margin: "0.5em" }} key={deck}>
          <Link to={`/deck/${deck}`} style={{ marginRight: "1em" }}>
            {deck}
          </Link>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDeleteDeck(deck)}
          >
            Delete
          </button>
        </div>
      ))}

      <input
        value={newDeckName}
        onChange={(e) => setNewDeckName(e.target.value)}
        style={{ marginRight: "0.5em" }}
      ></input>
      <button className="btn btn-primary" onClick={createNewDeck}>
        Create New Deck
      </button>
    </Container>
  );
}

export default DeckPage;
