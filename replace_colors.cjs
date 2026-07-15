const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'GuestPortal.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace invalid color classes
content = content.replace(/bg-teal-650/g, 'bg-teal-600');
content = content.replace(/bg-emerald-650/g, 'bg-emerald-600');
content = content.replace(/text-teal-650/g, 'text-teal-600');
content = content.replace(/text-emerald-650/g, 'text-emerald-600');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Colors replaced successfully!');
