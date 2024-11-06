import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetGame, updateInput, checkWord, decrementTime } from '../redux/GameSlice';

const TypingTest = () => {
  const dispatch = useDispatch();
  const { timeLeft, started, currentInput, wordIndex, entities, finished, correctCount, incorrectCount, keypressCount } = useSelector(state => state.game);

  useEffect(() => {
    
    if (!started) {
      dispatch(resetGame()); 
    }

    if (started && timeLeft > 0) {
      const timer = setInterval(() => {
        dispatch(decrementTime());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [started, timeLeft, dispatch]);

  const handleInputChange = (e) => {
    dispatch(updateInput(e.target.value));

    if (e.target.value.endsWith(" ") && e.target.value.trim().length > 0) {
      dispatch(checkWord());
    }
  };

  const handleReset = () => {
    dispatch(resetGame());
  };

  return (
    <div className="typing-test">
      <div className="word-list">
        {Object.values(entities).map((word, index) => (
          <span
            key={word.id}
            className={
              index === wordIndex
                ? "highlight"
                : word.correct === true
                ? "correct"
                : word.correct === false
                ? "incorrect"
                : ""
            }
          >
            {word.word + " "}
          </span>
        ))}
      </div>

      {finished ? (
        <div className="results">
          <h2>Sonuçlar</h2>
          <p>Doğru Kelimeler: {correctCount}</p>
          <p>Yanlış Kelimeler: {incorrectCount}</p>
          <p>Tuş Basma Sayısı: {keypressCount}</p>
          <button onClick={handleReset}>Yeniden Başlat</button>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            placeholder="Kelime yaz..."
          />
          <div className="controls">
            <button onClick={handleReset}>Yeniden Başlat</button>
            <span>{timeLeft} saniye</span>
          </div>
        </>
      )}
    </div>
  );
};

export default TypingTest;
