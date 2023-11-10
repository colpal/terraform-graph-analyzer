#!/usr/bin/env deno run --allow-read
import {
  generateChart,
  generateWaves,
  groupBackwards,
  groupForwards,
  parseEdges,
} from "./lib.js";

const text = await Deno.readTextFile(Deno.args[0]);
const edges = [...parseEdges(text)];
const forwards = groupForwards(edges);
const backwards = groupBackwards(edges);
const waves = [...generateWaves("[root] root", backwards, forwards)]
  .map((wave, index) => [index, wave]);
const chart = generateChart(waves);
console.log(waves, Deno.args[0], chart);
