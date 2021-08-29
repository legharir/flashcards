import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  border: 1px solid black;
  margin: 2em;
  padding: 1em;
`;

function Flashcard({ flashcard }) {
  const [answerVisibility, setAnswerVisibility] = useState(false);

  const onAnswerVisibilityToggleClicked = () => {
    setAnswerVisibility((answerVisibility) => !answerVisibility);
  };

  return (
    <Container>
      <div>{flashcard.question}</div>
      <button className="link-button" onClick={onAnswerVisibilityToggleClicked}>
        {answerVisibility ? "Hide Answer" : "Reveal Answer"}
      </button>
      <div>{answerVisibility && <span>{flashcard.answer}</span>}</div>
    </Container>
  );
}

export default Flashcard;
