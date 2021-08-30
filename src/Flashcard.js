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

function Flashcard({ flashcard, updateFlashcardStatus }) {
  const [answerVisibility, setAnswerVisibility] = useState(false);

  const onAnswerVisibilityToggleClicked = () => {
    setAnswerVisibility((answerVisibility) => !answerVisibility);
  };

  return (
    <Container status={flashcard.status}>
      <div>
        <StatusChanger onClick={() => updateFlashcardStatus("correct")}>
          ✔️
        </StatusChanger>
        <StatusChanger onClick={() => updateFlashcardStatus("incorrect")}>
          ❌
        </StatusChanger>
        <StatusChanger onClick={() => updateFlashcardStatus("unattempted")}>
          🔄
        </StatusChanger>
      </div>
      <QuestionAnswer text={flashcard.question} />
      <button className="link-button" onClick={onAnswerVisibilityToggleClicked}>
        {answerVisibility ? "Hide Answer" : "Reveal Answer"}
      </button>
      {answerVisibility && <QuestionAnswer text={flashcard.answer} />}
    </Container>
  );
}

export default Flashcard;
