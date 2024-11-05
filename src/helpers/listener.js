let buffer = "";

document.addEventListener('keydown', (event) => {
    buffer += event.key;

    if (buffer.includes("#") && buffer.includes("*")) {
        const startIdx = buffer.indexOf("#");
        const endIdx = buffer.indexOf("*", startIdx);

        if (startIdx >= 0 && endIdx > startIdx) {
            const message = buffer.substring(startIdx + 1, endIdx);

            try {   // Parse the message
                const speedMatch = message.match(/S(\d+)/);
                const vectorMatch = message.match(/V(\d+),(\d+)/);

                if (speedMatch && vectorMatch) {
                    const speed = parseInt(speedMatch[1]);
                    const vectorX = parseInt(vectorMatch[1]);
                    const vectorY = parseInt(vectorMatch[2]);
                    //NOTE: Here can be called the function to visualize the data
                    handleMessageData(speed, vectorX, vectorY);
                }
            } catch (error) {
                console.error("Error parsing message:", error);
            }

            buffer = "";
        }
    }
});

function handleMessageData(speed, vectorX, vectorY) {
    //Delete this action and add function or add function directly in the listener col 21
    // Example
    console.log(`Speed: ${speed}, Vector: [${vectorX}, ${vectorY}]`);
}
