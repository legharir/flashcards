import { useState } from "react";
import styled from "styled-components";
import QuestionAnswer from "./QuestionAnswer";

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
      <QuestionAnswer text={flashcard.question} />
      <button className="link-button" onClick={onAnswerVisibilityToggleClicked}>
        {answerVisibility ? "Hide Answer" : "Reveal Answer"}
      </button>
      {answerVisibility && <QuestionAnswer text={flashcard.answer} />}
    </Container>
  );
}

export default Flashcard;
