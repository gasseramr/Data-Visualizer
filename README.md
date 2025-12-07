# Algorithm Data Visualizer

Interactive, browser-based visualizations for classic sorting algorithms and Huffman coding. Built with HTML/CSS/JavaScript and uses D3.js (via CDN) to render the Huffman tree.

## Features

- Sorting visualizer: Bubble, Insertion, Selection, Merge, Quick, Heap, Counting, Radix
- Controls: array size, custom array input, animation speed, start/pause/reset, step-forward
- Complexity table: time and space complexities for each algorithm
- Huffman coding tool: frequency table, codes, encoded/decoded text, compression ratio
- Huffman tree visualization rendered with `d3`

## Getting Started

- Option 1 (no setup): Double‑click `index.html` to open in your browser (Chrome/Edge/Firefox)
- Option 2 (local server):
  - Python: `python -m http.server 8000` then open `http://localhost:8000/`
  - VS Code: use the Live Server extension to serve the folder
- OPTION 3 (UPLOADED)
   -https://data-visualizer-fawn.vercel.app/

## Usage

- Sorting
  - Set `Array Size` and click `Generate Random Array`, or enter numbers in `Use Custom Array` (comma‑separated)
  - Choose an algorithm, adjust `Animation Speed`, then click `Start Sorting`
  - Use `Pause/Resume`, `Reset`, and `Step Forward` to control the animation
- Huffman Coding
  - Enter text in `Input Text`
  - Click `Build Huffman Tree & Encode` to see frequencies, codes, the tree, encoded bits, and decoded text
  - `Reset` clears all results

## Project Structure

- `index.html` — UI layout and tabs for Sorting/Huffman
- `styles.css` — styling for panels, controls, bars, tables, and tree
- `script.js` — sorting implementations, animation engine, Huffman coding logic, D3 tree rendering
- `Documentation.pdf` — supplementary documentation

## Tech Stack

- HTML5, CSS3, JavaScript (vanilla)
- D3.js 7.x loaded from CDN for tree visualization

## Notes

- Works fully offline; internet is required only for the D3 CDN and Google Fonts referenced in `index.html`
- Tested in modern browsers; if the bars don’t render, ensure the container has width (resize the window once)

## Contributing

Issues and pull requests are welcome. Please keep changes modular and update this README when adding new algorithms or UI controls.
