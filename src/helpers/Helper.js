// src/helpers/helper.js
export function perspectiveProjection(a, b) {
    const fovl = 200;  // Field of view length
    const oldPos = a[b];  // Get the original position (x or y)
    const z = a[2];  // Get the z-coordinate
    const newPos = (fovl / (fovl + z)) * oldPos;  // Calculate new position based on perspective
    return newPos;  // Return the projected position
}
