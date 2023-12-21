import { VStack } from '@chakra-ui/react';
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const Canvas = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);

    useImperativeHandle(ref, () => ({
        clearCanvas() {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
      }));

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 300;
        canvas.height = 200;

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;
    }, []);

    const startDrawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        setIsDrawing(true);
        nativeEvent.preventDefault();
    };

    const draw = ({nativeEvent}) => {
        if(!isDrawing) {
            return;
        }
        
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        nativeEvent.preventDefault();
    };

    const stopDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };


  return (
    <VStack>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          onTouchLeave={stopDrawing}
          onMouseOut={stopDrawing}
          width={500}
          height={500}
          style={{background: 'white'}}
        />        
    </VStack>
  );
});

export default Canvas;