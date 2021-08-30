import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

function QuestionAnswer({ text, imageUrl, setFlashcardImage }) {
  async function handlePasteImage() {
    const clipboardData = await navigator.clipboard.read();
    for (const item of clipboardData) {
      const blob = await item.getType("image/png");
      setFlashcardImage(URL.createObjectURL(blob));
    }
  }

  return (
    <Container>
      <span>{text}</span>
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          styles={{ maxWidth: "60%", maxHeight: "500px" }}
        />
      )}
      <button onClick={handlePasteImage}>Paste Image</button>
    </Container>
  );
}

export default QuestionAnswer;
