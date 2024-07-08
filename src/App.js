import React, { useState, useEffect } from "react";
import HarmonicOscillator from './HarmonicOscillator';
import DampedOscillator from "./DampedOscillator";
import Menu from './Menu';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ForcedOscillator from "./ForcedOscillator";
import Quiz from 'react-quiz-component';
import { quiz } from "./quiz";

const App = () => {
    const [showXvt, setShowXvt] = useState(false);
    const [showEnergy, setShowEnergy] = useState(false);
    const [showA, setShowA] = useState(false);
    const [quizResult, setQuizResult] = useState(null);
    
    const handleQuizComplete = (obj) => {
        console.log(obj);
        console.log(obj.correctPoints);
        setQuizResult(obj.numberOfCorrectAnswers); // Pohranjuje broj točnih odgovora u stanje
      }

    return (
    <Router>
        <div id='container'>
            <Menu setShowXvt={setShowXvt} setShowEnergy={setShowEnergy} setShowA={setShowA}/>
            <br />
            <Routes>
                <Route path="/harmonijsko" element={<>
                <HarmonicOscillator showXvt={showXvt} showEnergy={showEnergy}/>
                </>}/>
                <Route path="/priguseno" element={<>
                <DampedOscillator showXvt={showXvt} showEnergy={showEnergy}/>
                </>}/>
                <Route path="/prisilno" element={<>
                <ForcedOscillator showXvt={showXvt} showEnergy={showEnergy}/>
                </>}/>
                <Route path="/provjera" element={<div className="quiz">
                    {quizResult !== null && <><br/><p>Rezultat: {quizResult}/12</p></>}
                    <Quiz quiz={quiz} onComplete={handleQuizComplete}/>
                    </div>}/>
            </Routes>
        </div>
    </Router>
    )
}

export default App;