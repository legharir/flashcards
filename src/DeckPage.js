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

  return (
    <Container>
      {newDeckCreated && <Redirect to={`/deck/${newDeckName}`} />}

      {decks.map((deck) => (
        <div key={deck}>
          <Link to={`/deck/${deck}`}>{deck}</Link>
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
