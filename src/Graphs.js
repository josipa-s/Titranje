import React, { useRef, useEffect } from "react";
import { Stage, Layer, Line, Text, Circle } from 'react-konva';
import { useLocation } from "react-router-dom";
import { InlineMath, BlockMath } from "react-katex"


export const calculateAmplitude = (omega, m, k, b, F0) => {
    return F0 / Math.sqrt(Math.pow(k - m * omega * omega, 2) + Math.pow(b * omega, 2));
  };
  
  export const AmplitudeFrequencyGraph = ({ m, k, b, F0, omegaMin, omegaMax, omegaStep, graphWidth, graphHeight, amplitude, omegap }) => {
    const points = useRef([]);
    const xLabels = useRef([]);
    const yLabels = useRef([]);
  
    useEffect(() => {
      const frequencies = [];
      const amplitudes = [];
      
      for (let omega = omegaMin; omega <= omegaMax; omega += omegaStep) {
        const amplitude = calculateAmplitude(omega, m, k, b, Math.abs(F0));
        frequencies.push(omega);
        amplitudes.push(amplitude);
      }
  
      const xScale = graphWidth / (omegaMax - omegaMin);
      const yScale = graphHeight / Math.max(...amplitudes);
  
      points.current = frequencies.map((omega, index) => ({
        x: (omega - omegaMin) * xScale,
        y: graphHeight - amplitudes[index] * yScale
      }));
  
      xLabels.current = frequencies.map((omega, index) => ({
        x: (omega - omegaMin) * xScale,
        y: graphHeight + 15,
        label: index % 5 === 0 ? omega.toFixed(1) : ''
      }));
  
      const yMax = Math.max(...amplitudes);
      yLabels.current = [
        { x: 5, y: 0, label: yMax.toFixed(2) },
        { x: 5, y: graphHeight / 2, label: (yMax / 2).toFixed(2) },
      ];
      const x = (omegap - omegaMin) * xScale;
    }, [m, k, b, F0]);

    const currentX = (omegap - omegaMin) * (graphWidth / (omegaMax - omegaMin));
    const currentY = graphHeight - amplitude * (graphHeight / Math.max(...points.current.map(p => graphHeight - p.y)));

  
    return (
      <>
      <p>Graf ovisnosti amplitude o frekvenciji</p>
      <InlineMath>A/cm</InlineMath>
      <Stage width={graphWidth} height={graphHeight + 30}>
        <Layer>
          <Line points={[0, 0, 0, graphHeight]} stroke="black" strokeWidth={1} />
          <Line points={[0, graphHeight, graphWidth, graphHeight]} stroke="black" strokeWidth={1} />
  
          {points.current.length > 1 && (
            <Line
              points={points.current.flatMap(point => [point.x, point.y])}
              stroke="cadetblue"
              strokeWidth={2}
              tension={0.1}
              lineCap="round"
              lineJoin="round"
            />
          )}
  
          {xLabels.current.map((label, index) => (
            <Text key={index} x={label.x} y={label.y} text={label.label} fontSize={12} />
          ))}
  
          {yLabels.current.map((label, index) => (
            <Text key={index} x={label.x} y={label.y} text={label.label} fontSize={12} />
          ))}

          <Line
          points={[currentX, graphHeight, currentX, 0]}
          stroke={"black"}
          strokeWidth={2}
          dash={[0, 5]}
          lineCap="round"
          lineJoin="round"/>
        </Layer>
      </Stage>
      <div className="math-container">
        <InlineMath className={'graf'}>{`\\omega_p/rad\\mathit{s}^{-1}`}</InlineMath>
      </div>
      </>
    );
  };

  export const XvtGraphs = ({ canvasWidth, graphHeight, graphWidth, velocityPointsRef, positionPointsRef, aPointsRef, amplitude, v_max, a_max, period }) => {
    const numXTicks = 10; // Adjust this value for more or fewer ticks
    const xTickSpacing = graphWidth / numXTicks;

    const getXTickPoints = () => {
        const points = [];
        for (let i = 0; i <= numXTicks; i++) {
            const x = i * xTickSpacing;
            points.push(x);
        }
        return points;
    };

    const xTickPoints = getXTickPoints();

    return (
        <>
            <p>Graf ovisnosti položaja o vremenu</p>
            <InlineMath>x/cm</InlineMath>
            <Stage width={graphWidth + 30} height={graphHeight} >
                <Layer>
                    <Line
                        points={[0, graphHeight / 2, graphWidth, graphHeight / 2]}
                        stroke={"black"}
                        tension={0.2}
                        lineCap="round"
                        lineJoin="round"
                        strokeWidth={1}
                    />
                    <Line
                        points={positionPointsRef}
                        stroke={"cadetblue"}
                        tension={0.2}
                        lineCap="round"
                        lineJoin="round"
                        strokeWidth={2}
                    />
                    <Line
                        points={[0, graphHeight, graphWidth, graphHeight]} 
                        stroke={"black"}
                        tension={0.2}
                        lineCap="round"
                        lineJoin="round"
                        strokeWidth={3}
                        dash={[0, 5]}
                    />
                    <Line
                        points={[0, 0, graphWidth, 0]} 
                        stroke={"black"}
                        tension={0.2}
                        lineCap="round"
                        lineJoin="round"
                        strokeWidth={2}
                        dash={[0, 5]}
                    />
                    {xTickPoints.map((x, i) =>  (
                        <React.Fragment key={i}>
                            <Line
                                points={[x, graphHeight / 2 - 5, x, graphHeight / 2 + 5]}
                                stroke={"black"}
                                tension={0.2}
                                lineCap="round"
                                lineJoin="round"
                                strokeWidth={1}
                            />
                            <Text
                                x={x - 5}
                                y={graphHeight / 2 + 10}
                                text={(i)}
                                fontSize={10}
                            />
                        </React.Fragment>
                    ))}
                    <Text 
                        x={1}
                        y={1}
                        text={(-amplitude).toFixed(2)}
                    />
                    <Text 
                        x={3}
                        y={graphHeight - 13}
                        text={amplitude.toFixed(2)}
                    />
                     <Text 
                        x={graphWidth - 15}
                        y={graphHeight / 2 + 20}
                        text={"t/s"}
                        fontStyle={"italic"}
                        fontSize={16}
                    />
                </Layer>
            </Stage>
            <br />
            <p>Graf ovisnosti brzine o vremenu</p>
            <InlineMath>{`v/\\mathit{cms}^{-1}`}</InlineMath>
            <Stage width={graphWidth + 30} height={graphHeight} >
                <Layer>
                    <Line
                        points={[0, graphHeight / 2, graphWidth, graphHeight / 2]}
                        stroke={"black"}
                        tension={0.2}
                        lineCap="round"
                        lineJoin="round"
                        strokeWidth={1}
                    />
                    <Line
                        points={velocityPointsRef}
                        stroke={"lime"}
                        tension={0.2}
                        lineCap="round"
                        lineJoin="round"
                        strokeWidth={2}
                    />
                    <Line
                        points={[0, graphHeight, graphWidth, graphHeight]} 
                        stroke={"black"}
                        tension={0.2}
                        lineCap="round"
                        lineJoin="round"
                        strokeWidth={3}
                        dash={[0, 5]}
                    />
                    <Line
                        points={[0, 0, graphWidth, 0]} 
                        stroke={"black"}
                        tension={0.2}
                        lineCap="round"
                        lineJoin="round"
                        strokeWidth={2}
                        dash={[0, 5]}
                    />
                    {xTickPoints.map((x, i) => (
                        <React.Fragment key={i}>
                            <Line
                                points={[x, graphHeight / 2 - 5, x, graphHeight / 2 + 5]}
                                stroke={"black"}
                                tension={0.2}
                                lineCap="round"
                                lineJoin="round"
                                strokeWidth={1}
                            />
                            <Text
                                x={x - 5}
                                y={graphHeight / 2 + 10}
                                text={(i)}
                                fontSize={10}
                            />
                        </React.Fragment>
                    ))}
                    <Text 
                        x={1}
                        y={1}
                        text={Math.abs(v_max).toFixed(2)}
                    />
                    <Text 
                        x={3}
                        y={graphHeight - 13}
                        text={(-Math.abs(v_max)).toFixed(2)}
                    />
                     <Text 
                        x={graphWidth - 15}
                        y={graphHeight / 2 + 20}
                        text={"t/s"}
                        fontStyle={"italic"}
                        fontSize={16}
                    />
                </Layer>
            </Stage>
            <br />
            <p>Graf ovisnosti akceleracije o vremenu</p>
            <InlineMath>{`a/\\mathit{cms}^{-2}`}</InlineMath>
            <Stage width={graphWidth + 30} height={graphHeight} >
                <Layer>
                    <Line
                        points={[0, graphHeight / 2, graphWidth, graphHeight / 2]}
                        stroke={"black"}
                        tension={0.2}
                        lineCap="round"
                        lineJoin="round"
                        strokeWidth={1}
                    />
                    <Line
                        points={aPointsRef}
                        stroke={"orange"}
                        tension={0.2}
                        lineCap="round"
                        lineJoin="round"
                        strokeWidth={2}
                    />
                    <Line
                        points={[0, graphHeight, graphWidth, graphHeight]} 
                        stroke={"black"}
                        tension={0.2}
                        lineCap="round"
                        lineJoin="round"
                        strokeWidth={3}
                        dash={[0, 5]}
                    />
                    <Line
                        points={[0, 0, graphWidth, 0]} 
                        stroke={"black"}
                        tension={0.2}
                        lineCap="round"
                        lineJoin="round"
                        strokeWidth={2}
                        dash={[0, 5]}
                    />
                    {xTickPoints.map((x, i) => (
                        <React.Fragment key={i}>
                            <Line
                                points={[x, graphHeight / 2 - 5, x, graphHeight / 2 + 5]}
                                stroke={"black"}
                                tension={0.2}
                                lineCap="round"
                                lineJoin="round"
                                strokeWidth={1}
                            />
                            <Text
                                x={x - 5}
                                y={graphHeight / 2 + 10}
                                text={(i)}
                                fontSize={10}
                            />
                        </React.Fragment>
                    ))}
                    <Text 
                        x={1}
                        y={1}
                        text={Math.abs(a_max).toFixed(2)}
                    />
                    <Text 
                        x={3}
                        y={graphHeight - 13}
                        text={(-Math.abs(a_max)).toFixed(2)}
                    />
                     <Text 
                        x={graphWidth - 15}
                        y={graphHeight / 2 + 20}
                        text={"t/s"}
                        fontStyle={"italic"}
                        fontSize={16}
                    />
                </Layer>
            </Stage>
            <br />
        </>
    );
};


export const EGraphs = ({ graphWidth, graphHeight, uPoints, kPoints, uxPoints, kxPoints, uPoint, kPoint, ePoints, u_max, k_max, e_start, period, amplitude }) => {
  const location = useLocation();
  const path = location.pathname;
  
  const numXTicks = 10; // Adjust this value for more or fewer ticks
  const xTickSpacing = graphWidth / numXTicks;

  const getXTickPoints = () => {
      const points = [];
      for (let i = 0; i <= numXTicks; i++) {
          const x = i * xTickSpacing;
          points.push(x);
      }
      return points;
  };

  const xTickPoints = getXTickPoints();

  return (
      <>
          <p>Graf ovisnosti energije o vremenu</p>
          <InlineMath>\\E/mJ</InlineMath>
          <Stage width={graphWidth + 25} height={graphHeight + 15} >
              <Layer>
                  <Line
                      points={uPoints}
                      stroke={"cadetblue"}
                      tension={0.2}
                      lineCap="round"
                      lineJoin="round"
                      strokeWidth={2}
                  />
                  <Line
                      points={kPoints}
                      stroke={"red"}
                      tension={0.2}
                      lineCap="round"
                      lineJoin="round"
                      strokeWidth={2}
                  />
                  <Line
                      points={[0, graphHeight, graphWidth, graphHeight]} 
                      stroke={"black"}
                      tension={0.2}
                      lineCap="round"
                      lineJoin="round"
                      strokeWidth={2}
                      dash={[0, 5]}
                  />
                  <Line
                      points={[0, 0, graphWidth, 0]} 
                      stroke={"black"}
                      tension={0.2}
                      lineCap="round"
                      lineJoin="round"
                      strokeWidth={2}
                      dash={[0, 5]}
                  />
                  {xTickPoints.map((x, i) => (
                      <React.Fragment key={i}>
                          <Line
                              points={[x, graphHeight - 5, x, graphHeight]}
                              stroke={"black"}
                              tension={0.2}
                              lineCap="round"
                              lineJoin="round"
                              strokeWidth={1}
                          />
                          <Text
                              x={x - 5}
                              y={graphHeight + 5}
                              text={(i)}
                              fontSize={10}
                          />
                      </React.Fragment>
                  ))}
                  <Text
                      x={5}
                      y={graphHeight / 2 + 45}
                      text='K'
                      fontSize={16}
                      stroke={"cadetblue"}
                  />
                  <Text
                      x={5}
                      y={graphHeight / 2 - 65}
                      text='U'
                      fontSize={16}
                      stroke={"red"}
                  />
                 
                  <Text 
                      x={graphWidth + 7}
                      y={graphHeight + 2}
                      text={"t/s"}
                      fontStyle={"italic"}
                      fontSize={16}
                  />
                  <Text 
                      x={1}
                      y={1}
                      text={(u_max).toFixed(2)}
                  />
              </Layer>
          </Stage>
          <br />
          { path !== '/priguseno' &&
          <>
              <p>Graf ovisnosti energije o položaju</p>
              <BlockMath>\\E/mJ</BlockMath>
              <Stage width={graphWidth + 50} height={graphHeight + 15} >
                  <Layer>
                      <Line
                          points={[graphWidth / 2, 0, graphWidth / 2, graphHeight]}
                          stroke={"black"}
                          tension={0.2}
                          lineCap="round"
                          lineJoin="round"
                          strokeWidth={1} 
                      />
                      <Line
                          points={uxPoints}
                          stroke={"cadetblue"}
                          tension={0.2}
                          lineCap="round"
                          lineJoin="round"
                          strokeWidth={2}
                      />
                      <Line
                          points={kxPoints}
                          stroke={"red"}
                          tension={0.2}
                          lineCap="round"
                          lineJoin="round"
                          strokeWidth={2}
                      />
                      <Circle
                          x={uPoint.x}
                          y={uPoint.y}
                          stroke={"black"} 
                          radius={5}
                      />
                      <Circle
                          x={kPoint.x}
                          y={kPoint.y}
                          stroke={"black"} 
                          radius={5}
                      />
                      <Line
                          points={[0, graphHeight, graphWidth, graphHeight]} 
                          stroke={"black"}
                          tension={0.2}
                          lineCap="round"
                          lineJoin="round"
                          strokeWidth={1}
                      />
                      <Line
                          points={[0, 0, graphWidth, 0]} 
                          stroke={"black"}
                          tension={0.2}
                          lineCap="round"
                          lineJoin="round"
                          strokeWidth={2}
                          dash={[0, 5]}
                      />
                      {xTickPoints.map((x, i) => (
                          <React.Fragment key={i}>
                              <Line
                                  points={[x, graphHeight - 5, x, graphHeight]}
                                  stroke={"black"}
                                  tension={0.2}
                                  lineCap="round"
                                  lineJoin="round"
                                  strokeWidth={1}
                              />
                              <Text
                                  x={x - 5}
                                  y={graphHeight + 5}
                                  text={((-Math.abs(amplitude / 50) - (2 * (amplitude / 50) * i / numXTicks)).toFixed(2))}
                                  fontSize={10}
                              />
                          </React.Fragment>
                      ))}
                      <Text
                          x={5}
                          y={graphHeight / 2 + 45}
                          text='K'
                          fontSize={16}
                          stroke={"cadetblue"}
                      />
                      <Text
                          x={5}
                          y={graphHeight / 2 - 65}
                          text='U'
                          fontSize={16}
                          stroke={"red"}
                      />
                      <Text 
                          x={graphWidth / 2 + 1}
                          y={1}
                          text={(u_max).toFixed(2)}
                      />
                     
                      
                      <Text 
                          x={graphWidth + 15}
                          y={graphHeight}
                          text={"x/cm"}
                          fontStyle={"italic"}
                          fontSize={16}
                      />
                  </Layer>
              </Stage>
          </> }
          { path === '/priguseno' && 
          <>
              <p>Graf ovisnosti ukupne energije o vremenu</p>
              <InlineMath>\\E/mJ</InlineMath>
              <Stage width={graphWidth + 30} height={graphHeight + 20} >
                  <Layer>
                      <Line
                          points={ePoints}
                          stroke={"cadetblue"}
                          tension={0.2}
                          lineCap="round"
                          lineJoin="round"
                          strokeWidth={2}
                      />
                      <Line
                          points={[0, graphHeight, graphWidth, graphHeight]} 
                          stroke={"black"}
                          tension={0.2}
                          lineCap="round"
                          lineJoin="round"
                          strokeWidth={2}
                          dash={[0, 5]}
                      />
                      <Line
                          points={[0, 0, graphWidth, 0]} 
                          stroke={"black"}
                          tension={0.2}
                          lineCap="round"
                          lineJoin="round"
                          strokeWidth={2}
                          dash={[0, 5]}
                      />
                      {xTickPoints.map((x, i) => (
                          <React.Fragment key={i}>
                              <Line
                                  points={[x, graphHeight - 5, x, graphHeight]}
                                  stroke={"black"}
                                  tension={0.2}
                                  lineCap="round"
                                  lineJoin="round"
                                  strokeWidth={1}
                              />
                              <Text
                                  x={x - 5}
                                  y={graphHeight + 5}
                                  text={i}
                                  fontSize={10}
                              />
                          </React.Fragment>
                      ))}
                      <Text
                          x={5}
                          y={graphHeight / 2 + 45}
                          text='E'
                          fontSize={16}
                          stroke={"cadetblue"}
                      />
                      
                      <Text 
                          x={graphWidth + 5}
                          y={graphHeight - 10}
                          text={"t/s"}
                          fontStyle={"italic"}
                          fontSize={16}
                      />
                   
                  </Layer>
              </Stage> 
          </>}
          
          <br />
      </>
  )
}
