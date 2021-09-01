import DeckPage from "./DeckPage";
import FlashcardPage from "./FlashcardPage";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  const [decks, setDecks] = useState(
    JSON.parse(localStorage.getItem("decks")) ?? []
  );

  useEffect(() => {
    localStorage.setItem("decks", JSON.stringify(decks));
  }, [decks]);

  return (
    <Router>
      <div>
        <Link to="/">Decks</Link>

        <Switch>
          <Route exact path="/">
            <DeckPage decks={decks} setDecks={setDecks} />
          </Route>
          <Route path="/deck/:deckName">
            <FlashcardPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
