const tokens = {
  paper: "#FBFAF7",
  surface: "#FFFFFF",
  ink: "#20241F",
  muted: "#6E6A5E",
  pine: "#2C5F4F",
};

const checks = [
  ["Ink on paper", tokens.ink, tokens.paper, 4.5],
  ["Muted on paper", tokens.muted, tokens.paper, 4.5],
  ["White on pine", tokens.surface, tokens.pine, 4.5],
];

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((start) => parseInt(value.slice(start, start + 2), 16));
}

function channelToLinear(channel) {
  const value = channel / 255;
  return value <= 0.03928
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const [red, green, blue] = hexToRgb(hex).map(channelToLinear);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

const failures = checks.flatMap(([name, foreground, background, minimum]) => {
  const ratio = contrastRatio(foreground, background);
  const formattedRatio = ratio.toFixed(2);

  console.log(`${name}: ${formattedRatio}:1`);

  return ratio >= minimum
    ? []
    : [`${name} failed: ${formattedRatio}:1 is below ${minimum}:1`];
});

if (failures.length > 0) {
  failures.forEach((failure) => console.error(failure));
  process.exit(1);
}
