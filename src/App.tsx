import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Box, Button, TextField, Typography } from "@mui/material";

export default function App() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    const [rectX, setRectX] = useState(0);
    const [rectY, setRectY] = useState(0);
    const [angleState, setAngleState] = useState(0);
    const [pivotXState, setPivotXState] = useState(0);
    const [pivotYState, setPivotYState] = useState(0);

    const [lt, setLt] = useState({x: 0, y: 0});
    const [rt, setRt] = useState({x: 0, y: 0});
    const [rb, setRb] = useState({x: 0, y: 0});
    const [lb, setLb] = useState({x: 0, y: 0});


    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;

        ctxRef.current = canvas.getContext("2d");
        const ctx = ctxRef.current;
        if (!ctx) return;

        drawAxis(ctx);
    }, []);

    function draw() {
        const ctx = ctxRef.current;
        if (!ctx) return;
        ctx.reset();
        drawAxis(ctx);

        drawRect(ctx);
        drawPivotPoint(ctx);
        updatePoints();
    }

    function updatePoints() {
        setLt(calcPoints(Number(rectX), Number(rectY + 100)));
        setRt(calcPoints(Number(rectX + 100), Number(rectY + 100)));
        setRb(calcPoints(Number(rectX + 100), Number(rectY)));
        setLb(calcPoints(Number(rectX), Number(rectY)));
    }

    function calcPoints(x: number, y: number): { x: number; y: number } {
        const pivotX = pivotXState + rectX;
        const pivotY = pivotYState + rectY;
        const angle = calcAngle();
        return {
            x: Number(((x - pivotX) * Math.cos(angle) - (y - pivotY) * Math.sin(angle) + pivotX).toFixed(2)),
            y: Number(((x - pivotX) * Math.sin(angle) + (y - pivotY) * Math.cos(angle) + pivotY).toFixed(2)),
        }
    }

    function drawPivotPoint(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(rectX, rectY);
        ctx.fillStyle = "red";
        ctx.arc(transferX(rectX + pivotXState), transferY(rectY + pivotYState), 5, 0, Math.PI * 2, true);
        ctx.fill()
    }

    function drawRect(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const angle = calcAngle();

        ctx.beginPath();
        ctx.translate(transferX(rectX + pivotXState), transferY(rectY + pivotYState));
        ctx.rotate(angle)
        ctx.rect(-pivotXState, pivotYState - 100, 100, 100);

        ctx.fillStyle = "gray";
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.restore();
    }

    function drawAxis(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.strokeStyle = "gray";
        ctx.moveTo(0, 500);
        ctx.lineTo(1000, 500);
        ctx.stroke();

        ctx.moveTo(500, 0);
        ctx.lineTo(500, 1000);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.moveTo(500, 500);
        ctx.arc(500, 500, 5, 0, Math.PI * 2, true);
        ctx.fill();
    }

    function transferX(xPoint: number) {
        return xPoint + 500;
    }

    function transferY(yPoint: number) {
        return yPoint * (-1) + 500;
    }

    function calcAngle() {
        return Math.PI * (angleState / 180) * -1;
    }

    return (
        <Box sx={{display: "flex", flexDirection: "row"}} gap={5}>
            <Box>
                <canvas ref={canvasRef} width={1100} height={1100}></canvas>
            </Box>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "start",
                border: "1px solid black",
                textAlign: "left",
                padding: "30px",
                borderRadius: "16px",
                width: "360px",
                flexShrink: 0,
            }} gap={3}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "start",
                    width: "100%"
                }} gap={2}>
                    <Typography sx={{textAlign: "left"}} variant="h5">점의 좌표</Typography>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid black",
                        textAlign: "left",
                        padding: "10px",
                        borderRadius: "16px",
                        width: "100%"
                    }} gap={1}>
                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                            <Typography>1. Left-Top</Typography>
                            <Typography>{lt.x}, {lt.y}</Typography>
                        </Box>
                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                            <Typography>2. Right-Top</Typography>
                            <Typography>{rt.x}, {rt.y}</Typography>
                        </Box>
                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                            <Typography>3. Right-Bottom</Typography>
                            <Typography>{rb.x}, {rb.y}</Typography>
                        </Box>
                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                            <Typography>4. Left-Bottom</Typography>
                            <Typography>{lb.x}, {lb.y}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box>
                    <Typography variant="h5">위치</Typography>
                    <Box sx={{display: "flex", alignItems: "center"}} gap={2}>
                        <Box sx={{display: "flex", alignItems: "center"}} gap={2}>
                            <Typography>X</Typography>
                            <TextField value={rectX} type="number"
                                       onChange={(e) => setRectX(Number(e.target.value))}/>
                        </Box>
                        <Box sx={{display: "flex", alignItems: "center"}} gap={2}>
                            <Typography>Y</Typography>
                            <TextField value={rectY} type="number"
                                       onChange={(e) => setRectY(Number(e.target.value))}/>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{width: "100%"}}>
                    <Typography variant="h5">회전</Typography>
                    <Box sx={{display: "flex", alignItems: "center"}} gap={2}>
                        <TextField value={angleState} type="number"
                                   onChange={(e) => setAngleState(Number(e.target.value))}/>
                    </Box>
                </Box>
                <Box>
                    <Typography variant="h5">원점</Typography>
                    <Box sx={{display: "flex", alignItems: "center"}} gap={2}>
                        <Box sx={{display: "flex", alignItems: "center"}} gap={2}>
                            <Typography>X</Typography>
                            <TextField value={pivotXState} type="number"
                                       onChange={(e) => setPivotXState(Number(e.target.value))}/>
                        </Box>
                        <Box sx={{display: "flex", alignItems: "center"}} gap={2}>
                            <Typography>Y</Typography>
                            <TextField value={pivotYState} type="number"
                                       onChange={(e) => setPivotYState(Number(e.target.value))}/>
                        </Box>
                    </Box>
                </Box>
                <Button variant="contained" fullWidth onClick={draw}>적용</Button>
            </Box>
        </Box>
    )
}