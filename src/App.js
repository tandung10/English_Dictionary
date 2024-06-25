import React, { useState, useMemo, useEffect } from "react";
import Result from "./components/Result";

const synouyms = window.speechSynthesis;

const App = () => {
  console.log(synouyms.getVoices());
  const voices = useMemo(() => {
    return synouyms.getVoices();
  }, []);
  const [voiceSelected, setVoiceSelected] = useState("Google US English");
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState("");
  const [meanings, setMeanings] = useState([]);
  const [phonetics, setPhonetics] = useState([]);
  const [word, setWord] = useState("");
  const [error, setError] = useState("");

  const dictionaryApi = async (text) => {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${text}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMeanings(data[0].meanings);
        setPhonetics(data[0].phonetics);
        setWord(data[0].word);
        setError("");
      })
      .catch((error) => {
        console.log(error);
        setError("Word not found");
      });
  };

  const reset = () => {
    setText("");
    setMeanings([]);
    setPhonetics([]);
    setWord("");
    setError("");
  };

  useEffect(() => {
    if (!text.trim()) return reset();

    const debounce = setTimeout(() => {
      dictionaryApi(text);
    }, 100);
    return () => clearTimeout(debounce);
  }, [text]);
  const startSpeech = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    const voice = voices.find((voice) => voice.name === voiceSelected);
    speech.voice = voice;
    synouyms.speak(speech);
  };

  const handleVoice = () => {
    if (!text.trim()) return;
    if (!synouyms.speaking) {
      startSpeech(text);
      setIsSpeaking("speak");
    } else {
      synouyms.cancel();
      setIsSpeaking("");
    }

    setInterval(() => {
      if (!synouyms.speaking) {
        setIsSpeaking("");
      }
    }, 5000);
  };
  return (
    <div className="container">
      <h1>English Dictionary</h1>

      <form>
        <div className="row">
          <textarea
            name=""
            id=""
            cols="30"
            rows="4"
            placeholder="Enter text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <div className="voice-icons">
            <div className="select-voices">
              <select
                value={voiceSelected}
                onChange={(e) => setVoiceSelected(e.target.value)}
              >
                {voices.map((voice) => {
                  return (
                    <option key={voice.name} value={voice.name}>
                      {voice.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <i
              className={`fa-solid fa-volume-high ${isSpeaking}`}
              onClick={handleVoice}
            ></i>
          </div>
        </div>
      </form>

      {text.trim() && !error && (
        <Result
          meanings={meanings}
          phonetics={phonetics}
          word={word}
          setText={setText}
        />
      )}
    </div>
  );
};

export default App;
