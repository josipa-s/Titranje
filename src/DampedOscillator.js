import { React, useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Line, Image, Path, Label, Text } from 'react-konva';
import { EGraphs, XvtGraphs } from './Graphs';
import Menu from './Menu';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';


const DampedOscillator = ({ showXvt, showEnergy }) => {

  const ravnoteza = 300;
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
  const [m, setM] = useState(1);
  const [k, setK] = useState(1);
  const [b, setB] = useState(1);
  const [totalE, setTotalE] = useState(0);
  const [springImage, setSpringImage] = useState(null);
  const springLength = 400;
  const canvasWidth = 200;
  const canvasHeight = 600;
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
  const ePointsRef = useRef([])
  var ke_start = null;
  var u_start = null;
  const [a_max, setA_max] = useState(0);
  const [v_max, setV_max] = useState(0);
  const [u_max, setU_max] = useState(0);
  const [k_max, setK_max] = useState(0);

  const equation = "m a = - k x - b v";
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
    const startX = canvasWidth / 2;
    const startY = 40;
    const endX = startX;
    const endY = startY + position;

    return [{ x: startX, y: startY }, { x: endX, y: endY }];
  };

  const drawVelocity = () => {
    const startX = 0;
    const startY = 100;
    const endX = startX + position;
    const endY = velocity;
    return [{ x: startX, y: startY}, {x: endX, y: endY}];
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(ravnoteza);
      if (dragged) {
        const period = 2 * Math.PI * Math.sqrt(m / k);
        setPeriod(period);
        const omega0 = Math.sqrt((k / m));
        const omega = Math.sqrt((k / m) - Math.pow(b / (2 * m), 2));
        const delta = (b / (2 * m));
        const t = (Date.now() - time) / 1000;
        var newPosition = 0;
        var v = 0;
        var a = 0;
        var v_max = 100;
        var a_max = 300;
        setTime(t);

        if ((omega0 * omega0 - delta * delta) > 0) {
          newPosition = amplitude * Math.pow(Math.E, (-b / (2 * m)) * t) * Math.cos(omega * t);
          v = amplitude * Math.exp(-delta * t) * (delta * Math.cos(omega * t) - omega * Math.sin(omega * t));
          a = -amplitude * Math.exp(-delta * t) * (delta * delta * Math.cos(omega * t) + 2 * delta * omega * Math.sin(omega * t) - omega * omega * Math.cos(omega * t));
          v_max = amplitude + omega;
          a_max = amplitude + omega * omega;
        } else if ((delta * delta - omega0 * omega0) > 0) {
          const q = Math.sqrt(delta * delta - omega0 * omega0);
          newPosition = amplitude * Math.pow(Math.E, -delta * t) * (Math.cosh(q * t) + (delta / q) * Math.sinh(q * t));
          v = amplitude * Math.exp(-delta * t) * (-delta * Math.cosh(q * t) - q * Math.sinh(q * t) + (delta / q) * (delta * Math.sinh(q * t) + q * Math.cosh(q * t)));
          a = amplitude * Math.exp(-delta * t) * (delta * delta * Math.cosh(q * t) + 2 * delta * q * Math.sinh(q * t) - q * q * Math.cosh(q * t) + (delta / q) * (delta * delta * Math.sinh(q * t) + 2 * delta * q * Math.cosh(q * t) + q * q * Math.sinh(q * t)));
          v_max = amplitude + (delta / q);
          a_max = (amplitude * delta * delta + 2 * delta * q + q * q + (delta / q) * delta * delta + 2 * delta * q + q * q) * 4;
        } else if (delta === omega0) {
          newPosition = amplitude * Math.pow(Math.E, -omega0 * t) * (1 + omega0 * t);
          v = -amplitude * omega0 * t * Math.exp(-omega0 * t);
          a = -amplitude * omega0 * omega0 * Math.exp(-omega0 * t) * (1 - 2 * t);
          v_max = amplitude * omega0;
        }

        setPosition(ravnoteza - newPosition);

        const v_scale = v_max / (graphHeight / 2 - 2);
        setVelocity(v);
        const x_scale = amplitude / (graphHeight / 2 - 2);
        const a_scale = a_max / (graphHeight / 2 - 2);
        const u = (k * Math.pow(newPosition, 2)) / 2;
        const u_max = (k * Math.pow(amplitude, 2)) / 2;
        const u_scale = u_max / graphHeight;
        setPotentialEnergy(u);

        const ke = (m * Math.pow(v, 2)) / 2;
        const k_max = (m * Math.pow(v_max, 2)) / 2;
        const k_scale = k_max / graphHeight;
        setKineticEnergy(ke);

        setTotalE(u + ke);
        setA_max(a_max);
        setV_max(v_max);
        setU_max(u_max);
        setK_max(k_max);

        const total_scale = (u_max + k_max) / graphHeight;

        if (!ke_start && ke !== 0) {
          ke_start = ke;
        }

        if (!u_start && u !== 0) {
          u_start = u;
        }

        const e_start = ke_start + u_start;
        console.log(e_start);

        if (t * 50 < graphWidth) {
          velocityPointsRef.current.push({ x: t * 50, y: (graphHeight / 2 - v / v_scale) });
          positionPointsRef.current.push({ x: t * 50, y: (graphHeight / 2 - newPosition / x_scale) });
          aPointsRef.current.push({ x: t * 50, y: (graphHeight / 2 - a / a_scale) });
          uPointsRef.current.push({ x: t * 50, y: -u / u_scale + graphHeight });
          kPointsRef.current.push({ x: t * 50, y: -ke / k_scale + graphHeight });
          ePointsRef.current.push({ x: t * 50, y: -(u + ke) / (e_start / graphHeight) + graphHeight });
        }

        if (t < period / 2) {
          uxPointsRef.current.push({ x: (newPosition + Math.abs(amplitude)) / (2 * Math.abs(amplitude) / graphWidth), y: u / u_scale + graphHeight });
          kxPointsRef.current.push({ x: (newPosition + Math.abs(amplitude)) / (2 * Math.abs(amplitude) / graphWidth), y: ke / k_scale + graphHeight });
        }

        uPointRef.current = { x: (newPosition + Math.abs(amplitude)) / (2 * Math.abs(amplitude) / graphWidth), y: u / u_scale + graphHeight };
        kPointRef.current = { x: (newPosition + Math.abs(amplitude)) / (2 * Math.abs(amplitude) / graphWidth), y: ke / k_scale + graphHeight };

        if (t > 240) {
          setDragged(false);
        }
      }
    }, 16);

    return () => clearInterval(interval);
  }, [dragged, amplitude, m, k, b]);


  function dragBound(pos) {
    const minY = 100;
    const maxY = 490;
    const newY = Math.max(minY, Math.min(pos.y, maxY));
    return {
      x: this.absolutePosition().x,
      y: newY,
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
      
    <Stage width={canvasWidth} height={canvasHeight}>
    <Layer>
        <Rect
          width={canvasWidth - 5}
          height={canvasHeight * 4 / 5}
          fill='lightblue'
          x={2.5}
          y={canvasHeight / 5 - 1}
          cornerRadius={[0, 0, 10, 10]}
          stroke={"cadetblue"}
          />
      </Layer>
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
          x={canvasWidth / 2 - 50}
          y={position}
          fill={"lightgrey"}
          stroke={"grey"}
          strokeWidth={1}
          draggable
          dragBoundFunc={dragBound}
          onMouseUp={(e) => {
            setDragged(true);
            setAmplitude(ravnoteza - e.target.y());
            setTime(Date.now());
            velocityPointsRef.current = [];
            positionPointsRef.current = [];
            aPointsRef.current = [];
            uPointsRef.current = [];
            kPointsRef.current = [];
            uxPointsRef.current = [];
            kxPointsRef.current = [];
          }
        }
        onDragMove={(e) => setPosition(e.target.y())}
        onMouseDown={(e) => {
          setDragged(false)
        }}
        />

        <Rect
          width={canvasWidth}
          height={40}
          fill='burlywood'
          x={0}
          y={canvasHeight - (canvasHeight - 40)}/>

       
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
    amplitude={amplitude}
    v_max={v_max}
    a_max={a_max}
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
      ePoints={ePointsRef.current.flatMap(point => [point.x, point.y])}
      u_max={u_max}
      k_max={k_max}
      period={period}
      e_start={ke_start + u_start}
      amplitude={amplitude}>
      </EGraphs>}
      <BlockMath>{equation}</BlockMath>
      <div className='velicine'>
        <div className='oznake'>
          <p><InlineMath>m</InlineMath> - masa tijela</p>
          <p><InlineMath>a</InlineMath> - akceleracija</p>
          <p><InlineMath>v</InlineMath> - brzina</p>
          <p><InlineMath>k</InlineMath> - konstanta opruge</p>
          <p><InlineMath>x</InlineMath> - pomak tijela od ravnotežnog položaja</p>
          <p><InlineMath>b</InlineMath> - faktor prigušenja</p>
        </div>
        <div className='unos'>
          <label for='mass'><InlineMath>m =</InlineMath> </label>
          <input type='number' value={m} name='mass' onChange={e => setM(e.target.value)}/> kg
          <br />
          <label for='constant'><InlineMath>k =</InlineMath> </label>
          <input type='number' value={k} name='constant' onChange={e => setK(e.target.value)} /> N/m
          <br />
          <label for='dampingFactor'><InlineMath>b =</InlineMath> </label>
          <input type='number' value={b} name='dampingFactor' onChange={e => setB(e.target.value)}/> Ns/m
        </div>
    </div>
    {/*
    <p>x = {ravnoteza - position}</p>
    <p>v = {velocity}</p>
    <p>t = {time}</p>
    <p>A = {amplitude}</p>
    <p>U = {potentialEnergy}</p>
    <p>K = {kineticEnergy}</p>
    <p>T = {period}</p>
    <p>E = {totalE}</p>
    */}
    </div>
  );
};

export default DampedOscillator;