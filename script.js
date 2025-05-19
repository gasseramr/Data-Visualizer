document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Check if sorting container exists
    const sortingContainer = document.getElementById('arrayContainer');
    if (sortingContainer) {
        console.log('Sorting container found');
    } else {
        console.error('Sorting container not found');
    }
    
    // Check if Huffman textarea exists
    const huffmanInput = document.getElementById('inputText');
    if (huffmanInput) {
        console.log('Huffman input found');
    } else {
        console.error('Huffman input not found');
    }
    
    // Test array visualization
    try {
        generateRandomArray();
        console.log('Array visualization successful');
    } catch (error) {
        console.error('Array visualization failed:', error);
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Initialize both visualizers
    initSorting();
    initHuffman();
    
    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Remove active classes
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active-sort');
                btn.classList.remove('active-huff');
            });
            
            // Add active class
            if (button.dataset.tab === 'sorting') {
                button.classList.add('active-sort');
            } else {
                button.classList.add('active-huff');
            }
            
            // Hide all panels
            document.querySelectorAll('.panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Show selected panel
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });
});

// ========== SORTING VISUALIZER FUNCTIONALITY ==========

// Global Variables
let array = [];
let animationSpeed = 50;
let isSorting = false;
let isPaused = false;
let animations = [];
let animationIndex = 0;
let sortingInterval;

// DOM Elements
const arraySizeInput = document.getElementById('arraySize');
const customArrayInput = document.getElementById('customArray');
const algorithmSelect = document.getElementById('algorithm');
const speedInput = document.getElementById('speed');
const arrayContainer = document.getElementById('arrayContainer');
const startSortBtn = document.getElementById('startSort');
const pauseSortBtn = document.getElementById('pauseSort');
const resetSortBtn = document.getElementById('resetSort');
const stepForwardBtn = document.getElementById('stepForward');
const generateArrayBtn = document.getElementById('generateArray');
const useCustomArrayBtn = document.getElementById('useCustomArray');
const currentAlgorithmInfo = document.getElementById('currentAlgorithm');

// Initialize
function initSorting() {
    // Generate initial array
    generateRandomArray();
    
    // Event listeners
    generateArrayBtn.addEventListener('click', generateRandomArray);
    useCustomArrayBtn.addEventListener('click', useCustomArray);
    startSortBtn.addEventListener('click', startSorting);
    pauseSortBtn.addEventListener('click', pauseSorting);
    resetSortBtn.addEventListener('click', resetSorting);
    stepForwardBtn.addEventListener('click', stepForward);
    speedInput.addEventListener('input', updateSpeed);
    algorithmSelect.addEventListener('change', updateAlgorithmInfo);
}

// Generate Random Array
function generateRandomArray() {
    resetSorting();
    
    const size = parseInt(arraySizeInput.value);
    array = [];
    
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    
    displayArray();
}

// Use Custom Array
function useCustomArray() {
    resetSorting();
    
    const input = customArrayInput.value;
    try {
        array = input.split(',').map(num => parseInt(num.trim()));
        
        // Validate input
        if (array.some(isNaN)) {
            throw new Error('Invalid input');
        }
        
        displayArray();
    } catch (error) {
        alert('Please enter valid numbers separated by commas (e.g., 5,2,8,3,1)');
    }
}

// Display Array as Bars
function displayArray() {
    arrayContainer.innerHTML = '';
    
    const maxVal = Math.max(...array);
    const width = Math.floor(arrayContainer.clientWidth / array.length) - 2;
    
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${(array[i] / maxVal) * 100}%`;
        bar.style.width = `${width}px`;
        
        arrayContainer.appendChild(bar);
    }
}

// Update Animation Speed
function updateSpeed() {
    animationSpeed = 101 - parseInt(speedInput.value);
}

// Start Sorting
function startSorting() {
    if (isSorting && isPaused) {
        // Resume sorting
        isPaused = false;
        pauseSortBtn.textContent = 'Pause';
        runAnimations();
    } else if (!isSorting) {
        // Start new sort
        isSorting = true;
        isPaused = false;
        startSortBtn.disabled = true;
        pauseSortBtn.disabled = false;
        stepForwardBtn.disabled = false;
        generateArrayBtn.disabled = true;
        useCustomArrayBtn.disabled = true;
        
        // Generate animations based on selected algorithm
        const algorithm = algorithmSelect.value;
        animations = [];
        animationIndex = 0;
        
        // Clone array to avoid modifying original during animation calculation
        const arrayCopy = [...array];
        
        switch (algorithm) {
            case 'bubble':
                bubbleSort(arrayCopy);
                break;
            case 'insertion':
                insertionSort(arrayCopy);
                break;
            case 'selection':
                selectionSort(arrayCopy);
                break;
            case 'merge':
                mergeSort(arrayCopy, 0, arrayCopy.length - 1);
                break;
            case 'quick':
                quickSort(arrayCopy, 0, arrayCopy.length - 1);
                break;
            case 'heap':
                heapSort(arrayCopy);
                break;
            case 'counting':
                countingSort(arrayCopy);
                break;
            case 'radix':
                radixSort(arrayCopy);
                break;
        }
        
        runAnimations();
    }
}

// Pause Sorting
function pauseSorting() {
    if (isSorting) {
        isPaused = !isPaused;
        
        if (isPaused) {
            pauseSortBtn.textContent = 'Resume';
            clearInterval(sortingInterval);
        } else {
            pauseSortBtn.textContent = 'Pause';
            runAnimations();
        }
    }
}

// Reset Sorting
function resetSorting() {
    isSorting = false;
    isPaused = false;
    clearInterval(sortingInterval);
    animationIndex = 0;
    animations = [];
    
    // Reset buttons
    startSortBtn.disabled = false;
    pauseSortBtn.disabled = true;
    stepForwardBtn.disabled = true;
    generateArrayBtn.disabled = false;
    useCustomArrayBtn.disabled = false;
    pauseSortBtn.textContent = 'Pause';
    
    // Redisplay array
    displayArray();
}

// Step Forward
function stepForward() {
    if (isSorting && animationIndex < animations.length) {
        // Pause automatic animation if running
        if (!isPaused) {
            pauseSorting();
        }
        
        // Execute next animation step
        executeAnimation(animations[animationIndex]);
        animationIndex++;
        
        // Check if we've reached the end
        if (animationIndex >= animations.length) {
            finishSorting();
        }
    }
}

// Run Animations
function runAnimations() {
    if (isPaused) return;
    
    clearInterval(sortingInterval);
    
    sortingInterval = setInterval(() => {
        if (animationIndex >= animations.length) {
            finishSorting();
            return;
        }
        
        executeAnimation(animations[animationIndex]);
        animationIndex++;
    }, animationSpeed);
}

// Execute a Single Animation
function executeAnimation(animation) {
    const bars = document.querySelectorAll('.bar');
    
    switch (animation.type) {
        case 'compare':
            // Highlight bars being compared
            bars[animation.indices[0]].classList.add('comparing');
            bars[animation.indices[1]].classList.add('comparing');
            
            // Remove highlight after a delay
            setTimeout(() => {
                bars[animation.indices[0]].classList.remove('comparing');
                bars[animation.indices[1]].classList.remove('comparing');
            }, animationSpeed * 0.8);
            break;
            
        case 'swap':
            // Update heights for swapped elements
            bars[animation.indices[0]].style.height = `${animation.heights[0]}%`;
            bars[animation.indices[1]].style.height = `${animation.heights[1]}%`;
            break;
            
        case 'overwrite':
            // Update height for single element
            bars[animation.indices[0]].style.height = `${animation.heights[0]}%`;
            break;
            
        case 'mark-sorted':
            // Mark element as sorted
            bars[animation.indices[0]].classList.add('sorted');
            break;
    }
}

// Finish Sorting
function finishSorting() {
    clearInterval(sortingInterval);
    isSorting = false;
    
    // Mark all bars as sorted
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => bar.classList.add('sorted'));
    
    // Reset buttons
    startSortBtn.disabled = true;
    pauseSortBtn.disabled = true;
    stepForwardBtn.disabled = true;
}

// Update Algorithm Information
function updateAlgorithmInfo() {
    const algorithm = algorithmSelect.value;
    let title = '';
    let description = '';
    
    switch (algorithm) {
        case 'bubble':
            title = 'Bubble Sort';
            description = 'Bubble Sort is a simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.';
            break;
        case 'insertion':
            title = 'Insertion Sort';
            description = 'Insertion Sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms but can be efficient for small data sets.';
            break;
        case 'selection':
            title = 'Selection Sort';
            description = 'Selection Sort works by dividing the input list into a sorted and an unsorted region. It repeatedly selects the smallest element from the unsorted region and moves it to the end of the sorted region.';
            break;
        case 'merge':
            title = 'Merge Sort';
            description = 'Merge Sort is an efficient, stable, comparison-based, divide and conquer algorithm. It divides the input array into two halves, recursively sorts them, and then merges the sorted halves.';
            break;
        case 'quick':
            title = 'Quick Sort';
            description = 'Quick Sort is an efficient divide-and-conquer algorithm. It works by selecting a "pivot" element and partitioning the array around the pivot, placing smaller elements before it and larger elements after it.';
            break;
        case 'heap':
            title = 'Heap Sort';
            description = 'Heap Sort uses a binary heap data structure to sort elements. It first builds a max heap, then repeatedly extracts the maximum element and rebuilds the heap until all elements are sorted.';
            break;
        case 'counting':
            title = 'Counting Sort';
            description = 'Counting Sort is a non-comparison-based algorithm that works by counting the number of objects having distinct key values, then using arithmetic to determine their positions in the output sequence.';
            break;
        case 'radix':
            title = 'Radix Sort';
            description = 'Radix Sort is a non-comparison-based sorting algorithm that sorts data with integer keys by grouping keys by the individual digits which share the same significant position and value.';
            break;
    }
    
    currentAlgorithmInfo.innerHTML = `<h4>${title}</h4><p>${description}</p>`;
}

// ========== SORTING ALGORITHM IMPLEMENTATIONS ==========

// Bubble Sort
function bubbleSort(arr) {
    const maxVal = Math.max(...arr);
    
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            // Compare elements
            animations.push({
                type: 'compare',
                indices: [j, j + 1]
            });
            
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                
                animations.push({
                    type: 'swap',
                    indices: [j, j + 1],
                    heights: [(arr[j] / maxVal) * 100, (arr[j + 1] / maxVal) * 100]
                });
            }
        }
        
        // Mark element as sorted
        animations.push({
            type: 'mark-sorted',
            indices: [arr.length - i - 1]
        });
    }
}

// Insertion Sort
function insertionSort(arr) {
    const maxVal = Math.max(...arr);
    
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        
        // Compare with previous elements
        animations.push({
            type: 'compare',
            indices: [i, j]
        });
        
        while (j >= 0 && arr[j] > key) {
            // Shift element to the right
            arr[j + 1] = arr[j];
            
            animations.push({
                type: 'overwrite',
                indices: [j + 1],
                heights: [(arr[j + 1] / maxVal) * 100]
            });
            
            j--;
            
            if (j >= 0) {
                animations.push({
                    type: 'compare',
                    indices: [i, j]
                });
            }
        }
        
        arr[j + 1] = key;
        
        animations.push({
            type: 'overwrite',
            indices: [j + 1],
            heights: [(arr[j + 1] / maxVal) * 100]
        });
    }
    
    // Mark all elements as sorted
    for (let i = 0; i < arr.length; i++) {
        animations.push({
            type: 'mark-sorted',
            indices: [i]
        });
    }
}

// Selection Sort
function selectionSort(arr) {
    const maxVal = Math.max(...arr);
    
    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i;
        
        for (let j = i + 1; j < arr.length; j++) {
            // Compare elements
            animations.push({
                type: 'compare',
                indices: [minIndex, j]
            });
            
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // Swap elements
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            
            animations.push({
                type: 'swap',
                indices: [i, minIndex],
                heights: [(arr[i] / maxVal) * 100, (arr[minIndex] / maxVal) * 100]
            });
        }
        
        // Mark element as sorted
        animations.push({
            type: 'mark-sorted',
            indices: [i]
        });
    }
    
    // Mark the last element as sorted
    animations.push({
        type: 'mark-sorted',
        indices: [arr.length - 1]
    });
}

// Merge Sort
function mergeSort(arr, left, right) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

function merge(arr, left, mid, right) {
    const maxVal = Math.max(...arr);
    const n1 = mid - left + 1;
    const n2 = right - mid;
    
    // Create temp arrays
    const L = new Array(n1);
    const R = new Array(n2);
    
    // Copy data to temp arrays
    for (let i = 0; i < n1; i++) {
        L[i] = arr[left + i];
    }
    for (let j = 0; j < n2; j++) {
        R[j] = arr[mid + 1 + j];
    }
    
    // Merge the temp arrays back
    let i = 0;
    let j = 0;
    let k = left;
    
    while (i < n1 && j < n2) {
        // Compare elements
        animations.push({
            type: 'compare',
            indices: [left + i, mid + 1 + j]
        });
        
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            
            animations.push({
                type: 'overwrite',
                indices: [k],
                heights: [(arr[k] / maxVal) * 100]
            });
            
            i++;
        } else {
            arr[k] = R[j];
            
            animations.push({
                type: 'overwrite',
                indices: [k],
                heights: [(arr[k] / maxVal) * 100]
            });
            
            j++;
        }
        k++;
    }
    
    // Copy the remaining elements of L[]
    while (i < n1) {
        arr[k] = L[i];
        
        animations.push({
            type: 'overwrite',
            indices: [k],
            heights: [(arr[k] / maxVal) * 100]
        });
        
        i++;
        k++;
    }
    
    // Copy the remaining elements of R[]
    while (j < n2) {
        arr[k] = R[j];
        
        animations.push({
            type: 'overwrite',
            indices: [k],
            heights: [(arr[k] / maxVal) * 100]
        });
        
        j++;
        k++;
    }
    
    // Mark the merged section as sorted if it's the final merge
    if (right - left + 1 === arr.length) {
        for (let i = 0; i < arr.length; i++) {
            animations.push({
                type: 'mark-sorted',
                indices: [i]
            });
        }
    }
}

// Quick Sort
function quickSort(arr, low, high) {
    if (low < high) {
        const pi = partition(arr, low, high);
        
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

function partition(arr, low, high) {
    const maxVal = Math.max(...arr);
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        // Compare elements with pivot
        animations.push({
            type: 'compare',
            indices: [j, high]
        });
        
        if (arr[j] <= pivot) {
            i++;
            
            // Swap elements
            [arr[i], arr[j]] = [arr[j], arr[i]];
            
            animations.push({
                type: 'swap',
                indices: [i, j],
                heights: [(arr[i] / maxVal) * 100, (arr[j] / maxVal) * 100]
            });
        }
    }
    
    // Swap pivot to its correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    animations.push({
        type: 'swap',
        indices: [i + 1, high],
        heights: [(arr[i + 1] / maxVal) * 100, (arr[high] / maxVal) * 100]
    });
    
    // Mark pivot as sorted
    animations.push({
        type: 'mark-sorted',
        indices: [i + 1]
    });
    
    return i + 1;
}

// Heap Sort
function heapSort(arr) {
    const maxVal = Math.max(...arr);
    const n = arr.length;
    
    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        [arr[0], arr[i]] = [arr[i], arr[0]];
        
        animations.push({
            type: 'swap',
            indices: [0, i],
            heights: [(arr[0] / maxVal) * 100, (arr[i] / maxVal) * 100]
        });
        
        // Mark element as sorted
        animations.push({
            type: 'mark-sorted',
            indices: [i]
        });
        
        // Call max heapify on the reduced heap
        heapify(arr, i, 0);
    }
    
    // Mark first element as sorted
    animations.push({
        type: 'mark-sorted',
        indices: [0]
    });
}

function heapify(arr, n, i) {
    const maxVal = Math.max(...arr);
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    // Compare with left child
    if (left < n) {
        animations.push({
            type: 'compare',
            indices: [largest, left]
        });
        
        if (arr[left] > arr[largest]) {
            largest = left;
        }
    }
    
    // Compare with right child
    if (right < n) {
        animations.push({
            type: 'compare',
            indices: [largest, right]
        });
        
        if (arr[right] > arr[largest]) {
            largest = right;
        }
    }
    
    // If largest is not root
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        
        animations.push({
            type: 'swap',
            indices: [i, largest],
            heights: [(arr[i] / maxVal) * 100, (arr[largest] / maxVal) * 100]
        });
        
        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest);
    }
}

// Counting Sort
function countingSort(arr) {
    const maxVal = Math.max(...arr);
    const n = arr.length;
    const output = new Array(n);
    const count = new Array(maxVal + 1).fill(0);
    
    // Store count of each element
    for (let i = 0; i < n; i++) {
        count[arr[i]]++;
    }
    
    // Store cumulative count
    for (let i = 1; i <= maxVal; i++) {
        count[i] += count[i - 1];
    }
    
    // Build the output array
    for (let i = n - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    
    // Copy the output array to arr
    for (let i = 0; i < n; i++) {
        animations.push({
            type: 'overwrite',
            indices: [i],
            heights: [(output[i] / maxVal) * 100]
        });
        
        arr[i] = output[i];
    }
    
    // Mark all elements as sorted
    for (let i = 0; i < n; i++) {
        animations.push({
            type: 'mark-sorted',
            indices: [i]
        });
    }
}

// Radix Sort
function radixSort(arr) {
    const maxVal = Math.max(...arr);
    
    // Do counting sort for every digit
    for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
        countingSortByDigit(arr, exp);
    }
    
    // Mark all elements as sorted
    for (let i = 0; i < arr.length; i++) {
        animations.push({
            type: 'mark-sorted',
            indices: [i]
        });
    }
}

function countingSortByDigit(arr, exp) {
    const maxVal = Math.max(...arr);
    const n = arr.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);
    
    // Store count of occurrences in count[]
    for (let i = 0; i < n; i++) {
        const digit = Math.floor(arr[i] / exp) % 10;
        count[digit]++;
    }
    
    // Change count[i] so that it contains actual position of this digit in output[]
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    // Build the output array
    for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }
    
    // Copy the output array to arr[]
    for (let i = 0; i < n; i++) {
        animations.push({
            type: 'overwrite',
            indices: [i],
            heights: [(output[i] / maxVal) * 100]
        });
        
        arr[i] = output[i];
    }
}

// ========== HUFFMAN CODING FUNCTIONALITY ==========

// Global variables for Huffman Coding
let huffmanTree = null;
let huffmanCodes = {};

// Initialize Huffman Tool
function initHuffman() {
    // DOM elements
    const inputText = document.getElementById('inputText');
    const encodeBtn = document.getElementById('encodeText');
    const resetBtn = document.getElementById('resetHuffman');
    
    // Event listeners
    encodeBtn.addEventListener('click', processHuffmanEncoding);
    resetBtn.addEventListener('click', resetHuffman);
}

// Reset Huffman Tool
function resetHuffman() {
    document.getElementById('inputText').value = '';
    document.getElementById('frequencyTable').innerHTML = '';
    document.getElementById('codesTable').innerHTML = '';
    document.getElementById('huffmanTree').innerHTML = '';
    document.getElementById('encodedText').innerHTML = '';
    document.getElementById('decodedText').innerHTML = '';
    document.getElementById('compressionRatio').innerHTML = '';
    
    huffmanTree = null;
    huffmanCodes = {};
}

// Process Huffman Encoding
function processHuffmanEncoding() {
    const text = document.getElementById('inputText').value;
    
    if (!text) {
        alert('Please enter some text to encode');
        return;
    }
    
    // Calculate character frequencies
    const frequencies = calculateFrequencies(text);
    
    // Build Huffman Tree
    huffmanTree = buildHuffmanTree(frequencies);
    
    // Generate Huffman Codes
    huffmanCodes = {};
    generateHuffmanCodes(huffmanTree, '', huffmanCodes);
    
    // Encode text
    const encodedText = encodeText(text, huffmanCodes);
    
    // Decode text
    const decodedText = decodeText(encodedText, huffmanTree);
    
    // Display results
    displayFrequencies(frequencies);
    displayHuffmanCodes(huffmanCodes);
    displayEncodedText(encodedText, text);
    displayDecodedText(decodedText);
    visualizeHuffmanTree(huffmanTree);
}

// Calculate character frequencies
function calculateFrequencies(text) {
    const frequencies = {};
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        frequencies[char] = (frequencies[char] || 0) + 1;
    }
    
    return frequencies;
}

// Node class for Huffman Tree
class HuffmanNode {
    constructor(char, freq) {
        this.char = char;
        this.freq = freq;
        this.left = null;
        this.right = null;
    }
}

// Build Huffman Tree
function buildHuffmanTree(frequencies) {
    // Create a leaf node for each character and add it to the priority queue
    const priorityQueue = [];
    
    Object.keys(frequencies).forEach(char => {
        priorityQueue.push(new HuffmanNode(char, frequencies[char]));
    });
    
    // Sort nodes by frequency (ascending)
    priorityQueue.sort((a, b) => a.freq - b.freq);
    
    // Build the Huffman Tree
    while (priorityQueue.length > 1) {
        // Remove the two nodes with the lowest frequencies
        const left = priorityQueue.shift();
        const right = priorityQueue.shift();
        
        // Create a new internal node with these two nodes as children
        // and with frequency equal to the sum of the two nodes' frequencies
        const parent = new HuffmanNode(null, left.freq + right.freq);
        parent.left = left;
        parent.right = right;
        
        // Add the new node to the priority queue
        priorityQueue.push(parent);
        
        // Sort the queue again
        priorityQueue.sort((a, b) => a.freq - b.freq);
    }
    
    // The remaining node is the root of the Huffman Tree
    return priorityQueue[0];
}

// Generate Huffman Codes
function generateHuffmanCodes(node, code, codes) {
    if (node === null) return;
    
    // If this is a leaf node (has a character), assign the code
    if (node.char !== null) {
        codes[node.char] = code;
    }
    
    // Traverse left (add 0 to code)
    generateHuffmanCodes(node.left, code + '0', codes);
    
    // Traverse right (add 1 to code)
    generateHuffmanCodes(node.right, code + '1', codes);
}

// Encode text using Huffman codes
function encodeText(text, codes) {
    let encodedText = '';
    
    for (let i = 0; i < text.length; i++) {
        encodedText += codes[text[i]];
    }
    
    return encodedText;
}

// Decode text using Huffman Tree
function decodeText(encodedText, tree) {
    let decodedText = '';
    let currentNode = tree;
    
    for (let i = 0; i < encodedText.length; i++) {
        // Navigate the tree based on the current bit
        if (encodedText[i] === '0') {
            currentNode = currentNode.left;
        } else {
            currentNode = currentNode.right;
        }
        
        // If this is a leaf node (has a character)
        if (currentNode.char !== null) {
            decodedText += currentNode.char;
            currentNode = tree; // Reset to the root for the next character
        }
    }
    
    return decodedText;
}

// Display frequency table
function displayFrequencies(frequencies) {
    const frequencyTable = document.getElementById('frequencyTable');
    frequencyTable.innerHTML = '';
    
    // Create table
    const table = document.createElement('table');
    table.className = 'frequency-table';
    
    // Table header
    const header = document.createElement('tr');
    header.innerHTML = '<th>Character</th><th>Frequency</th><th>Visualization</th>';
    table.appendChild(header);
    
    // Get max frequency for visualization scaling
    const maxFreq = Math.max(...Object.values(frequencies));
    
    // Add rows for each character
    Object.keys(frequencies).forEach(char => {
        const row = document.createElement('tr');
        
        // Character column (handle space and special characters)
        const charCell = document.createElement('td');
        charCell.textContent = char === ' ' ? 'Space' : char;
        row.appendChild(charCell);
        
        // Frequency column
        const freqCell = document.createElement('td');
        freqCell.textContent = frequencies[char];
        row.appendChild(freqCell);
        
        // Visualization column
        const visCell = document.createElement('td');
        const bar = document.createElement('div');
        bar.className = 'frequency-bar';
        bar.style.width = `${(frequencies[char] / maxFreq) * 100}%`;
        visCell.appendChild(bar);
        row.appendChild(visCell);
        
        table.appendChild(row);
    });
    
    frequencyTable.appendChild(table);
}

// Display Huffman codes
function displayHuffmanCodes(codes) {
    const codesTable = document.getElementById('codesTable');
    codesTable.innerHTML = '';
    
    // Create table
    const table = document.createElement('table');
    table.className = 'code-table';
    
    // Table header
    const header = document.createElement('tr');
    header.innerHTML = '<th>Character</th><th>Huffman Code</th>';
    table.appendChild(header);
    
    // Add rows for each character
    Object.keys(codes).forEach(char => {
        const row = document.createElement('tr');
        
        // Character column (handle space and special characters)
        const charCell = document.createElement('td');
        charCell.textContent = char === ' ' ? 'Space' : char;
        row.appendChild(charCell);
        
        // Code column with visualization
        const codeCell = document.createElement('td');
        const code = codes[char];
        
        for (let i = 0; i < code.length; i++) {
            const bit = document.createElement('span');
            bit.className = `binary-bit ${code[i] === '0' ? 'zero' : ''}`;
            bit.textContent = code[i];
            codeCell.appendChild(bit);
        }
        
        row.appendChild(codeCell);
        table.appendChild(row);
    });
    
    codesTable.appendChild(table);
}

// Display encoded text
function displayEncodedText(encodedText, originalText) {
    const encodedTextDiv = document.getElementById('encodedText');
    encodedTextDiv.innerHTML = '';
    
    // Display each bit with styling
    for (let i = 0; i < encodedText.length; i++) {
        const bit = document.createElement('span');
        bit.className = `bit bit-${encodedText[i]}`;
        bit.textContent = encodedText[i];
        encodedTextDiv.appendChild(bit);
    }
    
    // Calculate and display compression ratio
    const originalBits = originalText.length * 8; // Assuming 8 bits per character in original text
    const compressedBits = encodedText.length;
    const ratio = (originalBits / compressedBits).toFixed(2);
    
    document.getElementById('compressionRatio').textContent = 
        `Compression Ratio: ${ratio}x (Original: ${originalBits} bits, Compressed: ${compressedBits} bits)`;
}

// Display decoded text
function displayDecodedText(decodedText) {
    document.getElementById('decodedText').textContent = decodedText;
}

// Visualize Huffman Tree using D3.js
function visualizeHuffmanTree(tree) {
    const treeContainer = document.getElementById('huffmanTree');
    treeContainer.innerHTML = '';
    
    if (!tree) return;
    
    // Set up D3 tree layout
    const width = treeContainer.clientWidth;
    const height = 350;
    
    // Convert Huffman Tree to D3 hierarchical data
    const root = d3.hierarchy(convertToD3Format(tree));
    
    // Create tree layout
    const treeLayout = d3.tree().size([width - 80, height - 80]);
    treeLayout(root);
    
    // Create SVG
    const svg = d3.select('#huffmanTree')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(40, 40)`);
    
    // Add links
    svg.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d => {
            return `M${d.source.x},${d.source.y}C${d.source.x},${(d.source.y + d.target.y) / 2} ${d.target.x},${(d.source.y + d.target.y) / 2} ${d.target.x},${d.target.y}`;
        })
        .attr('fill', 'none')
        .attr('stroke', '#16A085')
        .attr('stroke-width', 2);
    
    // Add edge labels (0/1)
    svg.selectAll('.edge-label')
        .data(root.links())
        .enter()
        .append('text')
        .attr('class', 'edge-label')
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2 - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#2C3E50')
        .attr('font-size', '12px')
        .text(d => d.target.data.edgeLabel);
    
    // Add nodes
    const nodes = svg.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    
    // Add node circles
    nodes.append('circle')
        .attr('r', 20)
        .attr('fill', d => d.data.char ? '#E74C3C' : '#16A085')
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 2);
    
    // Add node labels
    nodes.append('text')
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d.data.char || d.data.freq);
    
    // Add frequency labels under the nodes
nodes.filter(d => !d.data.char)  // Only for internal nodes
    .append('text')
    .attr('dy', '40px')
    .attr('text-anchor', 'middle')
    .text(d => d.data.freq); 
}
//Convert Huffman Tree to D3 hierarchy format
function convertToD3Format(node) {
    if (!node) return null;
    
    // Create the node object
    const d3Node = {
        freq: node.freq,
        char: node.char ? (node.char === ' ' ? 'Space' : node.char) : null,
        edgeLabel: '', // Will be set for children
        children: []
    };
    
    // Add left child
    if (node.left) {
        const leftChild = convertToD3Format(node.left);
        leftChild.edgeLabel = '0';
        d3Node.children.push(leftChild);
    }
    
    // Add right child
    if (node.right) {
        const rightChild = convertToD3Format(node.right);
        rightChild.edgeLabel = '1';
        d3Node.children.push(rightChild);
    }
    
    return d3Node;
}
