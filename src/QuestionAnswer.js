import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export function Question({ flashcard }) {
  return (
    <QuestionAnswer
      text={flashcard.question}
      variant="question"
      imageUrl={flashcard.questionImageUrl}
    />
  );
}

export function Answer({ flashcard }) {
  return (
    <QuestionAnswer
      text={flashcard.answer}
      variant="answer"
      imageUrl={flashcard.answerImageUrl}
    />
  );
}

function QuestionAnswer({ text, imageUrl, variant }) {
  return (
    <Container>
      {variant === "question" ? <strong>{text}</strong> : <i>{text}</i>}
      {imageUrl && <img src={imageUrl} alt="" styles={{ maxWidth: "60%" }} />}
    </Container>
  );
}
