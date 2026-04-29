export default async function handler(req, res) {
  const userId = req.query.userId;
  const clientId = req.query.clientId || `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const embedScript = `
(function() {
  // Create container for chat widget
  const container = document.createElement('div');
  container.id = 'ai-sales-bot-widget';
  container.style.cssText = \`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 0;
    height: 0;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  \`;
  document.body.appendChild(container);

  // Create chat window
  const chatWindow = document.createElement('div');
  chatWindow.style.cssText = \`
    position: absolute;
    bottom: 0;
    right: 0;
    width: 400px;
    height: 500px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    display: none;
    flex-direction: column;
    overflow: hidden;
  \`;

  // Create iframe for the widget
  const iframe = document.createElement('iframe');
  iframe.src = '${process.env.VERCEL_URL || 'http://localhost:3000'}/widget.html?clientId=' + '${clientId}' + (${userId} ? '&userId=' + '${userId}' : '');
  iframe.style.cssText = \`
    border: none;
    width: 100%;
    height: 100%;
  \`;
  chatWindow.appendChild(iframe);

  container.appendChild(chatWindow);

  // Create toggle button
  const button = document.createElement('button');
  button.style.cssText = \`
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #0066cc;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 999998;
  \`;
  button.innerHTML = '💬';
  button.onclick = function() {
    const isOpen = chatWindow.style.display === 'flex';
    chatWindow.style.display = isOpen ? 'none' : 'flex';
    button.innerHTML = isOpen ? '💬' : '✕';
  };
  container.appendChild(button);
})();
`;

  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(embedScript);
}
