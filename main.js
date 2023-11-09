#!/usr/bin/env deno run --allow-read
import {
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
  .map((wave, index) => ({
    wave,
    index,
  }));
waves.sort((a, b) => b.wave.size - a.wave.size);
console.log(waves)
