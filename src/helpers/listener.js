let buffer = "";

const START_CHAR = '#';
const END_CHAR = '*';

document.addEventListener('keydown', (event) => {
    buffer += event.key;

    if (buffer.includes(START_CHAR) && buffer.includes(END_CHAR)) {
        const startIdx = buffer.indexOf(START_CHAR);
        const endIdx = buffer.indexOf(END_CHAR, startIdx);

        if (startIdx >= 0 && endIdx > startIdx) {
            const message = buffer.substring(startIdx + 1, endIdx);

            try {
                const parsedData = parseMessageData(message);

                handleParsedData(parsedData);
            } catch (error) {
                console.error("Error parsing message:", error);
            }

            buffer = "";
        }
    }
});

function parseMessageData(message) {
    const dataParts = message.split(',');

    if (dataParts.length !== 7) {
        throw new Error("Invalid message format");
    }
    const x = parseFloat(dataParts[0]);
    const y = parseFloat(dataParts[1]);
    const speed = parseFloat(dataParts[2]);
    const a = parseFloat(dataParts[3]);
    const b = parseFloat(dataParts[4]);
    const c = parseFloat(dataParts[5]);
    const avgX = parseFloat(dataParts[6]);

    return { x, y, speed, a, b, c, avgX };
}

function handleParsedData(data) {
    console.log("Parsed Data:", data);
}
