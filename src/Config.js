// src/Config.js
export const CONTAINER_WIDTH = 0.3;  // Set the desired global width
export const CONTAINER_HEIGHT = 0.6; // Set the desired global height
export const LANGUAGES = {
    sk: {
        language: "Slovenský jazyk",
        lang : "sk",
        onePlayer: "Hrať sám",
        twoPlayers: "Hrať s kamarátom",
        labelsTrue: "S názvami",
        labelsFalse: "Bez názvov",
        containers: {
            blue: "Papier",
            green: "Sklo",
            red: "Komunálny odpad",
            yellow: "Plast",
            black: "XYZ",
            orange: "XYZ"
        },
        score: "Skóre",
        time: "Čas"
    },
    en: {
        language: "English",
        lang: "en",
        onePlayer: "Play alone",
        twoPlayers: "Play with friend",
        labelsTrue: "With Labels",
        labelsFalse: "Without Labels",
        containers: {
            blue: "Paper",
            green: "Green",
            red: "Red",
            yellow: "Yellow",
            black: "Black",
            orange: "Orange",
        },
        score: "Skore",
        time: "Time"
    }
}
export const textStyle = {
    fontSize: '32px',
    fill: '#000000',
    fontFamily: 'Arial',
    fontWeight: 'bold'
}