const fs = require('fs');

const SFS2X_API_FILE_PATH = "./node_modules/sfs2x-api/sfs2x-api-1.7.17.js";

let data = fs.readFileSync(SFS2X_API_FILE_PATH, 'utf8');
data = data.replace('"JavaScript"', '"Unity WebGL"')
	.replace("SFS2X JavaScript API v", "SFS2X Unity WebGL API v")
	.replace('HTML5/JavaScript', 'Unity WebGL');
fs.writeFileSync(SFS2X_API_FILE_PATH, data, 'utf8');

