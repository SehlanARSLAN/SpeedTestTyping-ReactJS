import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const wordsAdapter = createEntityAdapter();

const initialState = wordsAdapter.getInitialState({
  timeLeft: 60,
  started: false,
  correctCount: 0,
  incorrectCount: 0,
  currentInput: "",
  wordIndex: 0,
  keypressCount: 0,
  finished: false,
  wordList: generateRandomWords(20),
});

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state) => {
      if (!state.started) { 
        state.started = true;
      }
      state.finished = false;
    },
    resetGame: (state) => {
      state.started = false;
      state.finished = false;
      state.timeLeft = 60;
      state.correctCount = 0;
      state.incorrectCount = 0;
      state.currentInput = "";
      state.wordIndex = 0;
      state.keypressCount = 0;
      state.wordList = generateRandomWords(20);
      wordsAdapter.setAll(state, state.wordList);
    },
    updateInput: (state, action) => {
      state.currentInput = action.payload;
      state.keypressCount += 1;

      if (!state.started && action.payload.trim().length > 0) {
        state.started = true;
      }
    },
    checkWord: (state) => {
      const currentWord = state.entities[state.wordIndex];
      if (!currentWord) return;

      if (state.currentInput.trim().length === 0) return;

      if (state.currentInput.trim() === currentWord.word) {
        state.correctCount += 1;
        state.entities[state.wordIndex].correct = true;
      } else {
        state.incorrectCount += 1;
        state.entities[state.wordIndex].correct = false;
      }

      state.wordIndex += 1;
      state.currentInput = "";

      if (state.wordIndex >= state.wordList.length) {
        if (state.timeLeft > 0) {
          const newWords = generateRandomWords(20); 
          state.wordList = newWords; 
          wordsAdapter.setAll(state, state.wordList); 
          state.wordIndex = 0; 
        } else {
          state.finished = true; 
        }
      }
    },
    decrementTime: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      }
      if (state.timeLeft <= 0) {
        state.finished = true;
      }
    },
  },
});

export const { startGame, resetGame, updateInput, checkWord, decrementTime } = gameSlice.actions;
export default gameSlice.reducer;

function generateRandomWords(count = 20) {
    const words = [
        "yok", "ad", "saat", "var", "ile", "burada", "ara", "biraz", "gibi", "biz", 
        "sonra", "atmak", "yapılmak", "sormak", "yol", "bir", "büyük", "el", "ancak", 
        "bulunmak", "çekmek", "verilmek", "dış", "tüm", "çocuk", "gün", "yeni", "eski", 
        "kız", "adam", "baba", "anne", "görmek", "gitmek", "girmek", "çıkmak", "olmak",
        "bilmek", "gelmek", "bulmak", "koymak", "kalmak", "yapmak", "öğrenmek", "duymak", 
        "saymak", "yazmak", "çekmek", "izlemek", "dönmek", "kalkmak", "satmak", "almak", 
        "gitmek", "düşünmek", "sevmek", "hoşlanmak", "beklemek", "görmek", "bulmak",
        "başlamak", "bitmek", "güzel", "akıl", "üzerine", "düşünmek", "konuşmak", "buldum",
        "takılmak", "güçlü", "yaklaşmak", "devam", "geçmek", "yazmak", "çalışmak", "hatırlamak",
        "yürümek", "atlamak", "denemek", "şarkı", "konu", "gece", "gündüz", "konuşma", 
        "yazılım", "odaklanmak", "başarmak", "etmek", "sevinmek", "gösterme", "yardımcı", 
        "eğlenmek", "düşünce", "okumak", "uzanmak", "bırakmak", "bekleyiş", "içmek", "gülmek",
        "araba", "telefon", "bilgisayar", "koşmak", "yüzmek", "dans etmek", "çalışmak", 
        "yemek", "içmek", "tekrar", "yapmak", "görüşmek", "çalışmak", "olmak", "yapmak",
        "şirket", "yazıcı", "müzik", "sinema", "kitap", "başkan", "gazete", "dergi", "film",
        "resim", "alışveriş", "oyun", "gezmek", "telefon", "vakit", "sınıf", "toplantı", 
        "gözlük", "kamera", "savaş", "barış", "mühendis", "gelişim", "arkadaş", "öğrenci",
        "öğretmen", "yöneticilik", "yolculuk", "sınav", "ödül", "para", "saat", "cep",
        "görüşme", "deniz", "havuz", "bulut", "gökyüzü", "yıldız", "uyum", "tartışma", 
        "kaybolmak", "bulmak", "bulutlar", "kar", "yağmur", "çalışma", "iş", "şirket",
        "kalem", "defter", "laptop", "gömlek", "pantolon", "elbise", "kot", "ayakkabı"
      ];
      
      
  const shuffled = words.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((word, index) => ({ id: index, word, correct: null }));
}
