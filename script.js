const scriptUrl = 'https://script.google.com/macros/s/AKfycbwGEtWwQ4j-lgh5_V9lyfReTQE5SLCYW9IiVo6cDyAIcSM4q0azFnwh9O2SLfC351kGpw/exec';

async function handleReaction(videoId, action) {
    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            body: JSON.stringify({ videoId: videoId, action: action }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}
