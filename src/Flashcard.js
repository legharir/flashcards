import styled from "styled-components";
import { Question, Answer } from "./QuestionAnswer";

const statusToColor = {
  correct: "#b9edaf",
  incorrect: "#edafb6",
};

const Container = styled.div`
  border: 1px solid #a4a4a4;
  margin: 1em 0em 1em 0em;
  padding: 1em;
  background: ${(props) => statusToColor[props.status]};
  border-radius: 5px;
`;

const Clickable = styled.span`
  cursor: pointer;
`;

const Horizontal = styled.div`
  display: flex;
  justify-content: space-between;
`;

const AttemptBadge = styled.span`
  margin: 0.2em;
`;

function Flashcard({
  flashcard,
  setShowAnswer,
  setFlashcardStatus,
  deleteFlashcard,
}) {
  return (
    <Container status={flashcard.status}>
      <Horizontal>
        <div>
          <Clickable onClick={() => setFlashcardStatus("correct")}>
            ✔️
          </Clickable>
          <Clickable onClick={() => setFlashcardStatus("incorrect")}>
            ❌
          </Clickable>
          <Clickable onClick={() => setFlashcardStatus("unattempted")}>
            🔄
          </Clickable>
        </div>
        <Clickable onClick={() => deleteFlashcard()}>🗑️</Clickable>
      </Horizontal>
      <div style={{ margin: "1em 1em 1em 0em" }}>
        {flashcard.attempts.map((attempt, idx) => (
          <AttemptBadge
            key={flashcard.question + idx}
            className={`badge badge-${
              attempt === "correct" ? "success" : "danger"
            }`}
          >
            {attempt}
          </AttemptBadge>
        ))}
      </div>
      <Question flashcard={flashcard} />
      <button
        className="btn btn-link btn-sm no-margin-left"
        onClick={() => setShowAnswer(!flashcard.showAnswer)}
      >
        {flashcard.showAnswer ? "Hide Answer" : "Reveal Answer"}
      </button>
      {flashcard.showAnswer && <Answer flashcard={flashcard} />}
    </Container>
  );
}

export default Flashcard;
