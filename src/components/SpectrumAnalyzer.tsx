import { useEffect, useRef } from 'react';

export default function SpectrumAnalyzer({ source, audioCtx, className }: any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const analyser = useRef<AnalyserNode | undefined>();
  const lowShelfFilter = useRef<BiquadFilterNode | undefined>();
  const floatDataArray = useRef<Float32Array>(new Float32Array());
  const barsCount = useRef(0);
  const barWidth = useRef(0);

  useEffect(() => {
    if (!audioCtx || !source) {
      return;
    }

    analyser.current = audioCtx.createAnalyser();
    lowShelfFilter.current = audioCtx.createBiquadFilter();

    lowShelfFilter.current!.type = 'lowshelf';
    lowShelfFilter.current!.frequency.value = 1200;
    lowShelfFilter.current!.gain.value = -18;

    source.connect(lowShelfFilter.current);
    lowShelfFilter.current!.connect(analyser.current!);

    analyser.current!.smoothingTimeConstant = 0.82;
    analyser.current!.fftSize = 128;

    barsCount.current = analyser.current!.frequencyBinCount / 3.2;
    floatDataArray.current = new Float32Array(analyser.current!.frequencyBinCount);
  }, [audioCtx, source]);

  useEffect(() => {
    canvasCtxRef.current = canvasRef.current!.getContext('2d')!;
    canvasCtxRef.current.globalCompositeOperation = 'screen';
    const fpsInterval = 1000 / 60;
    let then = Date.now();
    let elapsed;
    let now;
    let barHeight = 0;
    let x = 0;

    const WIDTH = canvasRef.current!.width;
    const HEIGHT = canvasRef.current!.height;
    const exp = 1.2;

    draw();

    function draw() {
      requestAnimationFrame(draw);

      now = Date.now();
      elapsed = now - then;
      then = now - (elapsed % fpsInterval);

      if (elapsed < fpsInterval) {
        return;
      }

      canvasCtxRef.current!.clearRect(0, 0, WIDTH + 10, HEIGHT);

      if (!analyser.current) {
        return;
      }

      analyser.current.getFloatFrequencyData(floatDataArray.current);

      x = 0;
      barWidth.current = Math.round((WIDTH - (barsCount.current - 1) * 3) / barsCount.current);
      for (let i = 0; i < barsCount.current; i++) {
        barHeight = HEIGHT * 2 - Math.abs(floatDataArray.current[i]) ** exp;

        if (barHeight < 0) barHeight = 0;
        if (barHeight > HEIGHT) barHeight = HEIGHT;

        canvasCtxRef.current!.fillStyle = '#ADC5FF';
        canvasCtxRef.current!.shadowColor = '#EAF7FF';
        canvasCtxRef.current!.shadowBlur = 15;
        canvasCtxRef.current!.fillRect(x, HEIGHT - barHeight, barWidth.current, barHeight);

        x += barWidth.current + (WIDTH - barsCount.current * barWidth.current) / (barsCount.current - 1);
      }
    }
  }, []);

  return <canvas ref={canvasRef} width="257" height="75" className={`${className}`}></canvas>;
}
