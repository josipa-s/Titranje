import { React, useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Line, Image, Path, Label, Text } from 'react-konva';
import { EGraphs, XvtGraphs } from './Graphs';
import Menu from './Menu';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

const HarmonicOscillator = ({ showXvt, showEnergy }) => {

  const ravnoteza = 370;
  const [position, setPosition] = useState(ravnoteza);
  //const [canvasWidth, setCanvasWidth] = useState(800);
  //const [canvasHeight, setCanvasHeight] = useState(200);
  const [dragged, setDragged] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [time, setTime] = useState(null);
  const [potentialEnergy, setPotentialEnergy] = useState(0);
  const [kineticEnergy, setKineticEnergy] = useState(0);
  const [period, setPeriod] = useState(0);
  const [mass, setMass] = useState(1);
  const [k, setK] = useState(1);
  const [springImage, setSpringImage] = useState(null);
  const springLength = 400;
  const canvasWidth = 800;
  const canvasHeight = 200;
  const graphHeight = 150;
  const graphWidth = 800;
  const velocityPointsRef = useRef([]);
  const positionPointsRef = useRef([]);
  const aPointsRef = useRef([]);
  const uPointsRef = useRef([]);
  const kPointsRef = useRef([]);
  const uPointRef = useRef([]);
  const kPointRef = useRef([]);
  const uxPointsRef = useRef([]);
  const kxPointsRef = useRef([]);
  const [v_max, setV_max] = useState(0);
  const [a_max, setA_max] = useState(0);
  const [u_max, setU_max] = useState(0);
  const [k_max, setK_max] = useState(0);

  const equation = "m a = - k x";
/*
  useEffect(() => {
    const updateDimensions = () => {
      setCanvasWidth(window.innerWidth);
      setCanvasHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
*/
  const drawSpring = () => {
    const startX = 0;
    const startY = canvasHeight / 2;
    const endX = startX + position;
    const endY = startY;
    return [{ x: startX, y: startY }, { x: endX, y: endY }];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if(dragged) {
        const period = 2 * Math.PI * Math.sqrt(mass / k);
        setPeriod(period);
        const t = (Date.now() - time) / 1000;
        setTime(t)
        const omega = Math.sqrt((k / mass));
        const x = amplitude * Math.cos(omega * t);
        const v = - amplitude * omega * Math.sin(omega * t);
        const a_max = Math.abs(amplitude * Math.pow(omega, 2));
        const a = - a_max * Math.cos(omega * t);
        setPosition(ravnoteza - x);
        setVelocity(v);
        const v_max = Math.abs(amplitude * omega);
        const v_scale = v_max / (graphHeight / 2 - 2);
        const x_scale = amplitude / (graphHeight / 2 - 2);
        const a_scale = a_max / (graphHeight / 2 - 2);
        const u = -(k * Math.pow(x / 50, 2)) / 2;
        const u_max = (k * Math.pow(amplitude / 50, 2)) / 2;
        const u_scale = u_max / graphHeight ;
        setPotentialEnergy(u);
        const ke = -(mass * Math.pow(v / 50, 2)) / 2;
        const k_max = (mass * Math.pow(v_max / 50, 2)) / 2;
        const k_scale = k_max / graphHeight;
        setKineticEnergy(ke);
        setA_max(a_max);
        setV_max(v_max);
        setU_max(u_max);
        setK_max(k_max);
        // Dodajemo trenutnu točku u niz točaka pomoću useRef
        if (t * 50 < canvasWidth) {
          velocityPointsRef.current.push({ x: t * 50, y: (graphHeight / 2 - v / v_scale) });
          positionPointsRef.current.push({x: t * 50, y: (graphHeight / 2 - x / x_scale)});
          aPointsRef.current.push({x: t * 50, y: (graphHeight / 2 - a / a_scale)});
          uPointsRef.current.push({x: t * 50, y: u / u_scale + graphHeight});
          kPointsRef.current.push({x: t * 50, y: ke / k_scale + graphHeight});
        };
        //console.log(period)
        if (t < period / 2) {
          uxPointsRef.current.push({ x: (x + Math.abs(amplitude)) / (2 * Math.abs(amplitude) / canvasWidth), y: u / u_scale + graphHeight});
          kxPointsRef.current.push({ x: (x + Math.abs(amplitude)) / (2 * Math.abs(amplitude) / canvasWidth), y: ke / k_scale + graphHeight});
          
        }
        uPointRef.current = {x: (x + Math.abs(amplitude)) / (2 * Math.abs(amplitude) / canvasWidth), y: u / u_scale + graphHeight};
        kPointRef.current = {x: (x + Math.abs(amplitude)) / (2 * Math.abs(amplitude) / canvasWidth), y: ke / k_scale + graphHeight};
          // Ograničavamo broj točaka kako bi crtanje bilo brže
          //if (pointsRef.current.length > 200) {
            //pointsRef.current.shift(); // Uklanjamo najstariju točku
          //}
        if (t > 240) {
          setDragged(false);
        }
      }
    }, 16); 
    
    return () => clearInterval(interval);
  }, [dragged, amplitude, mass, k]);

  

  function dragBound(pos) {
    const minX = 50;
    const maxX = 690;
    const newX = Math.max(minX, Math.min(pos.x, maxX));
    return {
      x: newX,
      y: this.absolutePosition().y,
    }
  }

  useEffect(() => {
    const spring = new window.Image();
    spring.src = "/spring.png";
    spring.onload = () => {
      setSpringImage(spring);
    };
  }, []);


  return (
    <div className='oscillator'>
   {/*} <p>Uteg pričvršćen na elastičnu nit je jednostavni harmonijski oscilator. Pomakni uteg i promatraj što se događa.</p> */}
    <br/>
    <Stage width={canvasWidth} height={canvasHeight}>
      <Layer>
        {/* Draw spring */}
        <Line
          points={drawSpring().flatMap(segment => [segment.x, segment.y])}
          stroke={"grey"}
          tension={0.2}
          lineCap="round"
          lineJoin="round"
          strokeWidth={2}
        />
        {/* Draw box */}
        <Rect id='uteg'
          width={100}
          height={100}
          cornerRadius={10}
          x={position}
          y={canvasHeight / 2 - 50}
          fill={"lightgrey"}
          stroke={"grey"}
          strokeWidth={1}
          draggable
          dragBoundFunc={dragBound}
          onMouseUp={(e) => {
            setDragged(true)
            setAmplitude((ravnoteza - e.target.x()))
            setTime(Date.now())
            velocityPointsRef.current = [];
            positionPointsRef.current = [];
            aPointsRef.current = [];
            uPointsRef.current = [];
            kPointsRef.current = [];
            uxPointsRef.current = [];
            kxPointsRef.current = [];
          }}
          onDragMove={(e) => setPosition(e.target.x())}
          onMouseDown={(e) => {
            setDragged(false)
          }}
        />
        
        <Rect
          width={canvasWidth}
          height={40}
          fill='burlywood'
          x={0}
          y={canvasHeight / 2 + 50}/>

        <Rect
          width={40}
          height={canvasHeight - 50}
          x={0}
          y={0}
          fill='burlywood'
        />
      </Layer>
      <Layer>
      <Line 
        points={[ravnoteza + 50, canvasHeight / 2 + 50, ravnoteza + 50, canvasHeight / 2 + 65]}
        stroke={"black"}
        tension={0.2}
        lineCap="round"
        lineJoin="round"
        strokeWidth={1}/>
      <Text
        x={ravnoteza + 35}
        y={canvasHeight / 2 + 70}
        text='x = 0'
        stroke={'black'}
        fontSize={14}
        strokeWidth={0.5} />
      </Layer>
      
    </Stage>
    <br></br>
    { showXvt && <XvtGraphs 
    canvasWidth={canvasWidth}
    graphHeight={graphHeight}
    graphWidth={graphWidth}
    velocityPointsRef={velocityPointsRef.current.flatMap(point => [point.x, point.y])}
    positionPointsRef={positionPointsRef.current.flatMap(point => [point.x, point.y])}
    aPointsRef={aPointsRef.current.flatMap(point => [point.x, point.y])}
    amplitude={amplitude / 50}
    v_max={v_max / 50}
    a_max={a_max / 50}
    period={period}
    ></XvtGraphs> }
    { showEnergy && <EGraphs
      graphHeight={graphHeight}
      graphWidth={graphWidth}
      uPoints={uPointsRef.current.flatMap(point => [point.x, point.y])}
      kPoints={kPointsRef.current.flatMap(point => [point.x, point.y])}
      uPoint={uPointRef.current}
      kPoint={kPointRef.current}
      uxPoints={uxPointsRef.current.flatMap(point => [point.x, point.y])}
      kxPoints={kxPointsRef.current.flatMap(point => [point.x, point.y])}
      u_max={u_max}
      k_max={k_max}
      period={period}
      amplitude={amplitude}>
      </EGraphs>}
    
    {/*<p>x = {position - ravnoteza}</p>
    <p>v = {velocity}</p>
    <p>t = {time}</p>
    <p>A = {amplitude}</p>
    <p>U = {potentialEnergy}</p>
    <p>K = {kineticEnergy}</p>
    <p>T = {period}</p>
    <p>m = {mass}</p> */}
    <BlockMath>{equation}</BlockMath>
    <div className='velicine'>
    <div className='oznake'>
    <p><InlineMath>m</InlineMath> - masa tijela</p>
    <p><InlineMath>a</InlineMath> - akceleracija</p>
    <p><InlineMath>k</InlineMath> - konstanta opruge</p>
    <p><InlineMath>x</InlineMath> - pomak tijela od ravnotežnog položaja</p>
    </div>
    <div className='unos'>
    <label for='mass'><InlineMath>m =</InlineMath> </label>
    <input type='number' value={mass} name='mass' onChange={e => setMass(e.target.value)}/> kg
    <br />
    <label for='constant'><InlineMath>k =</InlineMath> </label>
    <input type='number' value={k} name='constant' onChange={e => setK(e.target.value)} /> N/m
    <br/>
    </div>
    </div>
    {/*
    <p>Uteg mase m titra pod djelovanjem elastične sile koja je proporcionalne pomaku od ravnotežnog položaja:</p>
    <img src='/elasticnaSila.png'/>
    <p>gdje je</p>
    <p>F elastična sila koja vraća tijelo u ravnotežni položaj,</p>
    <p>k konstanta opruge (mjera krutosti opruge),</p>
    <p>x pomak tijela od ravnotežnog položaja.</p>
    <p>Znak minus (-) pokazuje da je smjer sile suprotan smjeru pomaka.</p>
    <p>Primjenom 2. Newtonovog zakona dobivamo jednadžbu koja opisuje harmonijsko titranje:</p>
    <img src='jednadzbaHarmonijsko.png'/>
    <p>gdje je </p>
    <img src='akceleracija.png'/>
    <p> akceleracija utega odnosno</p>
    <img src='jednadzbaHarmonijsko2.png'/>
    <p>gdje je kutna frekvencija</p>
    <img src='kutnaFrekvencija.png'/>
    <p>To je diferencijalna jednadžba 2. reda jer u sadrži drugu derivaciju. Rješenje te jednadžbe u ovom slučaju je </p>
    <img src='harmonijskoRjesenje.png'/>
    */}
    </div>
  );
};

export default HarmonicOscillator;

