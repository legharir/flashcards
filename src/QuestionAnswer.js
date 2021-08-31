import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export function Question({ flashcard, setFlashcardImage }) {
  return (
    <QuestionAnswer
      text={flashcard.question}
      variant="question"
      imageUrl={flashcard.questionImageUrl}
      setFlashcardImage={setFlashcardImage}
    />
  );
}

export function Answer({ flashcard, setFlashcardImage }) {
  return (
    <QuestionAnswer
      text={flashcard.question}
      variant="answer"
      imageUrl={flashcard.answerImageUrl}
      setFlashcardImage={setFlashcardImage}
    />
  );
}

function QuestionAnswer({ text, imageUrl, variant, setFlashcardImage }) {
  async function handlePasteImage() {
    const clipboardData = await navigator.clipboard.read();
    for (const item of clipboardData) {
      const blob = await item.getType("image/png");
      setFlashcardImage(URL.createObjectURL(blob));
    }
  }

  return (
    <Container>
      {variant === "question" ? <strong>{text}</strong> : <i>{text}</i>}
      {imageUrl && <img src={imageUrl} alt="" styles={{ maxWidth: "60%" }} />}
      <button className="btn btn-secondary btn-sm" onClick={handlePasteImage}>
        Paste Image
      </button>
    </Container>
  );
}
