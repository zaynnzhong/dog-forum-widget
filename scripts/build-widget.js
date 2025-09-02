const fs = require('fs');
const path = require('path');

const buildPath = path.join(__dirname, '..', 'build');
const widgetPath = path.join(__dirname, '..', 'widget');

if (!fs.existsSync(widgetPath)) {
  fs.mkdirSync(widgetPath);
}

const htmlContent = fs.readFileSync(path.join(buildPath, 'index.html'), 'utf8');

const jsFiles = fs.readdirSync(path.join(buildPath, 'static', 'js'))
  .filter(file => file.endsWith('.js') && !file.includes('.map'));

const cssFiles = fs.readdirSync(path.join(buildPath, 'static', 'css'))
  .filter(file => file.endsWith('.css') && !file.includes('.map'));

let widgetHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    #dog-forum-widget {
      width: 100%;
      height: 100%;
      min-height: 600px;
    }
  </style>
`;

cssFiles.forEach(file => {
  const cssContent = fs.readFileSync(path.join(buildPath, 'static', 'css', file), 'utf8');
  widgetHtml += `<style>${cssContent}</style>\n`;
});

widgetHtml += `
</head>
<body>
  <div id="dog-forum-widget"></div>
`;

jsFiles.forEach(file => {
  const jsContent = fs.readFileSync(path.join(buildPath, 'static', 'js', file), 'utf8');
  widgetHtml += `<script>${jsContent}</script>\n`;
});

widgetHtml += `
</body>
</html>
`;

fs.writeFileSync(path.join(widgetPath, 'dog-forum-widget.html'), widgetHtml);

const embedCode = `
<!-- Dog Forum Widget Embed Code -->
<!-- Add this code to your Webflow page where you want the widget to appear -->
<div id="dog-forum-widget-container" style="width: 100%; min-height: 600px;">
  <iframe 
    src="YOUR_HOSTING_URL/dog-forum-widget.html"
    style="width: 100%; height: 100%; min-height: 600px; border: none; border-radius: 16px;"
    title="Dog Forum Widget">
  </iframe>
</div>
<!-- End Dog Forum Widget -->
`;

fs.writeFileSync(path.join(widgetPath, 'embed-code.txt'), embedCode);

console.log('Widget built successfully!');
console.log(`Output: ${widgetPath}/dog-forum-widget.html`);
console.log(`Embed code: ${widgetPath}/embed-code.txt`);