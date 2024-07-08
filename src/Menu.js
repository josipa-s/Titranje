import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


const Menu = ({ setShowXvt, setShowEnergy, setShowA }) => {

    const location = useLocation();
    const path = location.pathname;

    const navigate = useNavigate();
    const handleClickHarmonijsko = () => navigate("/harmonijsko");
    const handleClickPriguseno = () => navigate("/priguseno");
    const handleClickPrisilno = () => navigate("/prisilno");
    const handleClickProvjera = () => navigate("/provjera")

    const handleClickXvt = () => {
        setShowXvt(true);
        setShowEnergy(false);
        setShowA(false);
    }

    const handleClickE = () => {
        setShowEnergy(true);
        setShowXvt(false);
        setShowA(false);
    }

    const handleClickA = () => {
        setShowEnergy(false);
        setShowXvt(false);
        setShowA(true);
    }

    return <>
    <div id="menu">
        <h1 id="title">Titranje</h1>
        <div id="buttons">
        <button className="main-buttons"
        onClick={handleClickHarmonijsko}>Harmonijsko</button>
        <button className="main-buttons"
        onClick={handleClickPriguseno}>Prigušeno</button>
        <button className="main-buttons"
        onClick={handleClickPrisilno}>Prisilno</button>
        <button className="main-buttons"
        onClick={handleClickProvjera}>Provjera</button>
        </div>
    </div>
    { (path === '/harmonijsko' || path === '/priguseno' || path === '/prisilno') &&
    <div id="side-container">
    <div id="side-menu">
        <h2>Grafovi</h2>
        <button className="side-btns" onClick={handleClickXvt}>Položaj, brzina, akceleracija</button>
        { (path !== '/prisilno' &&
        <button className="side-btns" onClick={handleClickE}>Energija</button>
        )}
        { (path === '/prisilno' && 
        <button className="side-btns" onClick={handleClickE}>Amplituda i gfrekvencija</button>
        )}
    </div>
    </div>
    }
    </>
}

export default Menu;