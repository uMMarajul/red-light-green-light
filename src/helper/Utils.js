

export function createLoadingScreen() {
    // Create a div for the loading screen
    let loadingScreen
    loadingScreen = document.createElement('div');
    loadingScreen.style.position = 'fixed';
    loadingScreen.style.top = '0';
    loadingScreen.style.left = '0';
    loadingScreen.style.width = '100%';
    loadingScreen.style.height = '100%';
    loadingScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    loadingScreen.style.color = 'white';
    loadingScreen.style.display = 'flex';
    loadingScreen.style.justifyContent = 'center';
    loadingScreen.style.alignItems = 'center';
    loadingScreen.style.zIndex = '1000';
    loadingScreen.innerHTML = `<h1>Loading...</h1>`;
    document.body.appendChild(loadingScreen);
    return loadingScreen
}

export function createStartButton() {
    // Create a start button
    let startButton;

    startButton = document.createElement('button');
    startButton.textContent = 'Start Game';
    startButton.style.position = 'fixed';
    startButton.style.top = '50%';
    startButton.style.left = '50%';
    startButton.style.transform = 'translate(-50%, -50%)';
    startButton.style.padding = '10px 20px';
    startButton.style.fontSize = '20px';
    startButton.style.backgroundColor = '#28a745';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '5px';
    startButton.style.cursor = 'pointer';
    startButton.style.zIndex = '1001';
    startButton.style.display = 'none'; // Hide by default
    document.body.appendChild(startButton);

    return startButton;
}
