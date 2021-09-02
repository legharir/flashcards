import { useState } from "react";
import { Link, Redirect } from "react-router-dom";

function DeckPage({ decks, setDecks }) {
  const [newDeckName, setNewDeckName] = useState("");
  const [newDeckCreated, setNewDeckCreated] = useState(false);

  const createNewDeck = () => {
    setDecks([...decks, newDeckName]);
    setNewDeckCreated(true);
  };

  return (
    <div>
      {newDeckCreated && <Redirect to={`/deck/${newDeckName}`} />}

      {decks.map((deck) => (
        <div key={deck}>
          <Link to={`/deck/${deck}`}>{deck}</Link>
        </div>
      ))}

      <input
        value={newDeckName}
        onChange={(e) => setNewDeckName(e.target.value)}
      ></input>
      <button className="btn btn-primary" onClick={createNewDeck}>
        Create New Deck
      </button>
    </div>
  );
}

export default DeckPage;
