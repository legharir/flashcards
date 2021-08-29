function Flashcard({flashcard}) {
    return (
        <div>
            {flashcard.question}
            {flashcard.answer}
        </div>
    )
}

export default Flashcard;