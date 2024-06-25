import React from "react";

const Result = ({ word, meanings, phonetics, setText }) => {
  return (
    <ul>
      <li className="word">
        <h2>{word}</h2>
        {phonetics.map((phonetic, index) => (
          <span key={index}>{phonetic.text}</span>
        ))}
      </li>

      {meanings.map((meaning, index) => (
        <li key={index} className="contain">
          <h3>Meaning</h3>

          {meaning.definitions.map((definition, index) => (
            <div key={index} className="details meaning">
              <p key={index}>{definition.definition}</p>
            </div>
          ))}

          {meaning.synonyms.length > 0 && (
            <div className="details synouyms">
              <h3>synouyms</h3>
              {meaning.synonyms.map((synonym, index) => (
                <span key={index} onClick={() => setText(synonym)}>
                  {`${synonym},`}
                </span>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Result;
