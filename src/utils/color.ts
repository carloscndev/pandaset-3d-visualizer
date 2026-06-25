const MIN_Z = -4;
const MAX_Z = 20;

const stops: [number, number, number][] = [
  [0x00, 0x12, 0x21],
  [0x00, 0x28, 0x40],
  [0x00, 0x49, 0x6f],
  [0x00, 0x6c, 0xa3],
  [0x00, 0x92, 0xda],
  [0x5d, 0xb8, 0xff],
  [0xbc, 0xdb, 0xff],
  [0xe1, 0xe0, 0xfd],
  [0xb6, 0xb4, 0xfa],
  [0x8c, 0x88, 0xf7],
  [0x61, 0x5a, 0xf3],
  [0x33, 0x1f, 0xe8],
  [0x1c, 0x0f, 0x92],
  [0x07, 0x03, 0x41],
];

const N = stops.length - 1;

export const heightColor = (t: number): [number, number, number] => {
  const clamped = Math.max(0, Math.min(1, t));
  const index = clamped * N;
  const i = Math.floor(index);
  const f = index - i;
  const a = stops[Math.min(i, N)];
  const b = stops[Math.min(i + 1, N)];
  return [
    (a[0] + (b[0] - a[0]) * f) / 255,
    (a[1] + (b[1] - a[1]) * f) / 255,
    (a[2] + (b[2] - a[2]) * f) / 255,
  ];
};

export const getZRange = () => ({ minZ: MIN_Z, maxZ: MAX_Z });