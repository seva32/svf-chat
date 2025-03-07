import { server } from "./index.cjs";

const port = process.env.port || 3333;

server.listen(port, () => {
  console.log(
    `\x1B[40m \x1B[35m Listening at \x1B[34m http://localhost:${port} \x1B[32m`
  );
});

server.on("error", console.error);

// Color	Foreground Code	Background Code
// Black	30	40
// Red	31	41
// Green	32	42
// Yellow	33	43
// Blue	34	44
// Magenta	35	45
// Cyan	36	46
// Light Gray	37	47
// Gray	90	100
// Light Red	91	101
// Light Green	92	102
// Light Yellow	93	103
// Light Blue	94	104
// Light Magenta	95	105
// Light Cyan	96	106
// White	97	107
