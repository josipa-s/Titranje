import { React, useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Line, Image, Path, Label, Text, Circle } from 'react-konva';
import { EGraphs, XvtGraphs, AmplitudeFrequencyGraph } from './Graphs';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

const ForcedOscillator = ({ showXvt, showEnergy }) => {
    const ravnoteza = 250;
    const [position, setPosition] = useState(ravnoteza);
    const [dragged, setDragged] = useState(false);
    const [amplitude, setAmplitude] = useState(0);
    const [velocity, setVelocity] = useState(0);
    const [time, setTime] = useState(null);
    const [potentialEnergy, setPotentialEnergy] = useState(0);
    const [kineticEnergy, setKineticEnergy] = useState(0);
    const [period, setPeriod] = useState(0);
    const [m, setM] = useState(1);
    const [k, setK] = useState(2);
    const [b, setB] = useState(0.2);
    const [F0, setF0] = useState(1); // Amplituda prisilne sile
    const [f, setf] = useState(100);
    const [omegap, setOmegap] = useState(0.5);
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
    const [a_max, setA_max] = useState(0);
    const [v_max, setV_max] = useState(0);
  
    const equation = "m a = - k x - b v + F_p \\cos(\\omega_p t)";

    const drawSpring = () => {
      const startX = canvasWidth / 2;
      const startY = f;
      const endX = startX;
      const endY = position;
  
      return [{ x: startX, y: startY }, { x: endX, y: endY }];
    };
  
    useEffect(() => {
      const interval = setInterval(() => {
        if(dragged) {
          const t = (Date.now() - time) / 1000;
          setTime(t);
          const period = 2 * Math.PI * Math.sqrt(m / k);
          setPeriod(period);
          const omega0 = Math.sqrt(k / m);
          const omega = Math.sqrt((k / m) - Math.pow(b / (2 * m), 2));
          const F = F0 * Math.cos(omegap * t);
          const amplitude = (F0 / Math.sqrt(Math.pow(k - m * Math.pow(omegap, 2), 2) + b * b * omegap * omegap));
          const angle = Math.atan(((b / m) * omegap) / (Math.pow(omega0, 2) - Math.pow(omegap, 2))) 
          const newPosition = amplitude * Math.cos(omegap * t + angle);
          const v = - amplitude * omegap * Math.sin(omegap * t + angle);
          const a_max = Math.abs(amplitude * Math.pow(omegap, 2));
          const a = - a_max * Math.cos(omegap * t + angle);
          const u = (k * Math.pow(newPosition, 2)) / 2;
          setAmplitude(amplitude);
          setPosition(ravnoteza - newPosition);
          setf(100 - F);
          setVelocity(v);

          setPotentialEnergy(u);
          const ke = (m * Math.pow(v, 2)) / 2;
          setKineticEnergy(ke);
          const v_max = amplitude * omegap;
          const a_scale = a_max / (graphHeight / 2 - 2);
          const v_scale = v_max / (graphHeight / 2 - 2);
          const x_scale = amplitude / (graphHeight / 2 - 2);
          const u_max = (k * Math.pow(amplitude, 2)) / 2;
          const u_scale = u_max / graphHeight;
          const k_max = (m * Math.pow(v_max, 2)) / 2;
          const k_scale = k_max / graphHeight;
          setA_max(a_max);
          setV_max(v_max);
  
          if (t * 50 < graphWidth) {
            velocityPointsRef.current.push({ x: t * 50, y: (graphHeight / 2 - v / v_scale)});
            positionPointsRef.current.push({ x: t * 50, y: (graphHeight / 2 - newPosition / x_scale)});
            aPointsRef.current.push({ x: t * 50, y: (graphHeight / 2 - a / a_scale)});
            uPointsRef.current.push({ x: t * 50, y: u / u_scale });
            kPointsRef.current.push({ x: t * 50, y: ke / k_scale });
          }
  
          if (t < period) {
            uxPointsRef.current.push({ x: (newPosition + Math.abs(amplitude)) / (2 * Math.abs(amplitude) / graphWidth), y: u / u_scale  });
            kxPointsRef.current.push({ x: (newPosition + Math.abs(amplitude)) / (2 * Math.abs(amplitude) / graphWidth), y: ke / k_scale});
          }
          uPointRef.current = { x: (newPosition + Math.abs(amplitude)) / (2 * Math.abs(amplitude) / graphWidth), y: u / u_scale  };
          kPointRef.current = { x: (newPosition + Math.abs(amplitude)) / (2 * Math.abs(amplitude) / graphWidth), y: ke / k_scale };
  
          if (t > 240) {
            setDragged(false);
          }
        }
      }, 16);
  
      return () => clearInterval(interval);
    }, [dragged, m, k, b, omegap]);
  
    function dragBound(pos) {
      return {
        x: this.absolutePosition().x,
        y: pos.y,
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
            <Line
              points={drawSpring().flatMap(segment => [segment.x, segment.y])}
              stroke={"grey"}
              tension={0.2}
              lineCap="round"
              lineJoin="round"
              strokeWidth={2}
            />
            <Rect
              id='uteg'
              width={100}
              height={100}
              cornerRadius={10}
              x={canvasWidth / 2 - 50}
              y={position}
              fill={"lightgrey"}
              stroke={"grey"}
              strokeWidth={1}
            />
            <Circle
            x={60}
            y={f}
            radius={40}
            stroke={'grey'}
            fill='darkgrey'
            draggable
            dragBoundFunc={dragBound}
            onMouseUp={(e) => {
              setDragged(true);
              setF0((100 - e.target.y()) / 2);
              setTime(Date.now());
              velocityPointsRef.current = [];
              positionPointsRef.current = [];
              aPointsRef.current = [];
              uPointsRef.current = [];
              kPointsRef.current = [];
              uxPointsRef.current = [];
              kxPointsRef.current = [];
            }}
            onDragMove={(e) => setf(e.target.y())}
            onMouseDown={(e) => setDragged(false)}
              />
            
          </Layer>
        </Stage>
        <br />
        { showXvt && <XvtGraphs 
          canvasWidth={canvasWidth}
          graphHeight={graphHeight}
          graphWidth={graphWidth}
          velocityPointsRef={velocityPointsRef.current.flatMap(point => [point.x, point.y])}
          positionPointsRef={positionPointsRef.current.flatMap(point => [point.x, point.y])}
          aPointsRef={aPointsRef.current.flatMap(point => [point.x, point.y])}
          a_max={a_max}
          v_max={v_max}
          period={period}
          amplitude={amplitude}
        />}
        { showEnergy && /*<EGraphs 
          //canvasWidth={canvasWidth}
          graphHeight={graphHeight}
          graphWidth={graphWidth}
          uPoints={uPointsRef.current.flatMap(point => [point.x, point.y])}
          kPoints={kPointsRef.current.flatMap(point => [point.x, point.y])}
          uxPoints={uxPointsRef.current.flatMap(point => [point.x, point.y])}
          kxPoints={kxPointsRef.current.flatMap(point => [point.x, point.y])}
          uPoint={uPointRef.current}
          kPoint={kPointRef.current}
          
        />*/
        <AmplitudeFrequencyGraph
        m={m}
        k={k}
        b={b}
        F0={F0}
        omegaMin={0}
        omegaMax={5}
        omegaStep={0.1}
        graphWidth={graphWidth / 3 * 2}
        graphHeight={graphHeight}
        amplitude={amplitude}
        omegap={omegap}
      />}
        
        <BlockMath>{equation}</BlockMath>
        <div className='velicine'>
          <div className='oznake'>
            <p><InlineMath>m</InlineMath> - masa tijela</p>
            <p><InlineMath>a</InlineMath> - akceleracija</p>
            <p><InlineMath>v</InlineMath> - brzina</p>
            <p><InlineMath>k</InlineMath> - konstanta opruge</p>
            <p><InlineMath>x</InlineMath> - pomak tijela od ravnotežnog položaja</p>
            <p><InlineMath>b</InlineMath> - faktor prigušenja</p>
            <p><InlineMath>F_p</InlineMath> - amplituda vanjske harmonijske sile</p>
            <p><InlineMath>\omega_p</InlineMath> - frekvencija vanjske periodične sile</p>
          </div>
          <div className='unos'>
            <label for='mass'><InlineMath>m = </InlineMath> </label>
            <input type='number' value={m} name='mass' onChange={e => setM(e.target.value)}/> kg
            <br />
            <label for='constant'><InlineMath>k =</InlineMath> </label>
            <input type='number' value={k} name='constant' onChange={e => setK(e.target.value)} /> N/m
            <br />
            <label for='dampingFactor'><InlineMath>b =</InlineMath> </label>
            <input type='number' value={b} name='dampingFactor' onChange={e => setB(e.target.value)}/> Ns/m
            <br />
            <label for='omegap'><InlineMath>\omega_p =</InlineMath> </label>
            <input type='number' value={omegap} name='omegap' onChange={e => setOmegap(e.target.value)} /> rad/s
          </div>
        </div>
        {/*<p>x = {position - ravnoteza}</p>
        <p>v = {velocity}</p>
        <p>t = {time}</p>
        <p>A = {amplitude}</p>
        <p>U = {potentialEnergy}</p>
        <p>K = {kineticEnergy}</p>
        <p>T = {period}</p>
        <p>m = {m}</p> */}
      </div>
    );
  };
  
  export default ForcedOscillator;
  