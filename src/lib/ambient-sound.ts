export type AmbientId =
  | "silence"
  | "rain"
  | "forest"
  | "ocean"
  | "cafe"
  | "fireplace"
  | "white"
  | "brown"
  | "pink";

export const AMBIENT_SOUNDS: { id: AmbientId; name: string }[] = [
  { id: "rain", name: "Rain" },
  { id: "forest", name: "Forest" },
  { id: "ocean", name: "Ocean" },
  { id: "cafe", name: "Café" },
  { id: "fireplace", name: "Fireplace" },
  { id: "white", name: "White Noise" },
  { id: "brown", name: "Brown Noise" },
  { id: "pink", name: "Pink Noise" },
  { id: "silence", name: "Silence" },
];

type NoiseColor = "white" | "brown" | "pink";

type Preset = {
  color: NoiseColor;
  filter: BiquadFilterType;
  frequency: number;
  q: number;
  /** Slow amplitude sway, in Hz, that makes the loop feel organic. */
  lfoRate: number;
  lfoDepth: number;
  gain: number;
};

const PRESETS: Record<Exclude<AmbientId, "silence">, Preset> = {
  rain: { color: "white", filter: "bandpass", frequency: 1400, q: 0.6, lfoRate: 0.16, lfoDepth: 0.22, gain: 0.7 },
  forest: { color: "pink", filter: "highpass", frequency: 900, q: 0.5, lfoRate: 0.09, lfoDepth: 0.35, gain: 0.5 },
  ocean: { color: "brown", filter: "lowpass", frequency: 700, q: 0.7, lfoRate: 0.07, lfoDepth: 0.6, gain: 0.95 },
  cafe: { color: "pink", filter: "lowpass", frequency: 1100, q: 0.4, lfoRate: 0.22, lfoDepth: 0.28, gain: 0.6 },
  fireplace: { color: "brown", filter: "lowpass", frequency: 480, q: 1.1, lfoRate: 0.55, lfoDepth: 0.5, gain: 0.9 },
  white: { color: "white", filter: "highshelf", frequency: 2000, q: 1, lfoRate: 0, lfoDepth: 0, gain: 0.4 },
  brown: { color: "brown", filter: "lowpass", frequency: 900, q: 1, lfoRate: 0, lfoDepth: 0, gain: 0.9 },
  pink: { color: "pink", filter: "lowpass", frequency: 3000, q: 1, lfoRate: 0, lfoDepth: 0, gain: 0.6 },
};

function buildNoiseBuffer(ctx: AudioContext, color: NoiseColor) {
  const length = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  if (color === "white") {
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  } else if (color === "brown") {
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
  } else {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  }
  return buffer;
}

class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private nodes: AudioNode[] = [];
  private sound: AmbientId = "silence";
  private volume = 0.5;
  private playing = false;

  private ensureContext() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private teardown() {
    this.nodes.forEach((node) => {
      try {
        (node as AudioScheduledSourceNode).stop?.();
      } catch {
        /* not a source node */
      }
      node.disconnect();
    });
    this.nodes = [];
  }

  private build() {
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    this.teardown();
    if (this.sound === "silence") return;

    const preset = PRESETS[this.sound];
    const source = ctx.createBufferSource();
    source.buffer = buildNoiseBuffer(ctx, preset.color);
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = preset.filter;
    filter.frequency.value = preset.frequency;
    filter.Q.value = preset.q;

    const gain = ctx.createGain();
    gain.gain.value = preset.gain;

    source.connect(filter).connect(gain).connect(this.master);
    source.start();
    this.nodes.push(source, filter, gain);

    if (preset.lfoDepth > 0) {
      const lfo = ctx.createOscillator();
      lfo.frequency.value = preset.lfoRate;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = preset.gain * preset.lfoDepth;
      lfo.connect(lfoGain).connect(gain.gain);
      lfo.start();
      this.nodes.push(lfo, lfoGain);
    }
  }

  private applyVolume() {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const target = this.playing && this.sound !== "silence" ? this.volume : 0;
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setTargetAtTime(target, ctx.currentTime, 0.4);
  }

  setSound(sound: AmbientId) {
    if (this.sound === sound) return;
    this.sound = sound;
    if (this.playing) {
      this.build();
      this.applyVolume();
    }
  }

  setVolume(volume: number) {
    this.volume = Math.min(1, Math.max(0, volume));
    this.applyVolume();
  }

  play() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    void ctx.resume();
    this.playing = true;
    if (this.nodes.length === 0) this.build();
    this.applyVolume();
  }

  pause() {
    this.playing = false;
    this.applyVolume();
  }

  stop() {
    this.playing = false;
    this.applyVolume();
    window.setTimeout(() => {
      if (!this.playing) this.teardown();
    }, 600);
  }

  /** Soft two-note completion chime. */
  chime() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    void ctx.resume();
    [660, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const at = ctx.currentTime + i * 0.28;
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(0.18, at + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(at);
      osc.stop(at + 1.5);
    });
  }
}

let engine: AmbientEngine | null = null;

export function getAmbientEngine() {
  if (!engine) engine = new AmbientEngine();
  return engine;
}