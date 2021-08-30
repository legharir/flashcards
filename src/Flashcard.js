import { useState } from "react";
import styled from "styled-components";
import QuestionAnswer from "./QuestionAnswer";

const statusToColor = {
  correct: "#b9edaf",
  incorrect: "#edafb6",
};

const Container = styled.div`
  border: 1px solid black;
  margin: 2em;
  padding: 1em;
  background: ${(props) => statusToColor[props.status]};
`;

const StatusChanger = styled.span`
  cursor: pointer;
`;

function Flashcard({ flashcard, setFlashcardStatus, setFlashcardImage }) {
  const [answerVisibility, setAnswerVisibility] = useState(false);

  const onAnswerVisibilityToggleClicked = () => {
    setAnswerVisibility((answerVisibility) => !answerVisibility);
  };

  return (
    <Container status={flashcard.status}>
      <div>
        <StatusChanger onClick={() => setFlashcardStatus("correct")}>
          ✔️
        </StatusChanger>
        <StatusChanger onClick={() => setFlashcardStatus("incorrect")}>
          ❌
        </StatusChanger>
        <StatusChanger onClick={() => setFlashcardStatus("unattempted")}>
          🔄
        </StatusChanger>
      </div>
      <QuestionAnswer
        text={flashcard.question}
        imageUrl={flashcard.questionImageUrl}
        setFlashcardImage={(...args) => setFlashcardImage(true, ...args)}
      />
      <button className="link-button" onClick={onAnswerVisibilityToggleClicked}>
        {answerVisibility ? "Hide Answer" : "Reveal Answer"}
      </button>
      {answerVisibility && (
        <QuestionAnswer
          text={flashcard.answer}
          imageUrl={flashcard.answerImageUrl}
          setFlashcardImage={(...args) => setFlashcardImage(false, ...args)}
        />
      )}
    </Container>
  );
}

export default Flashcard;
