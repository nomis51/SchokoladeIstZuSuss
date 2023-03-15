You can look at the hex code to figure out each fields and their data types and sometimes their values aswell.

"zone" is currently DevZone. It's a utf string. It's the SmartFox server "lobby" you log in. Just look at the 2nd message sent on the Unity client websocket connection to know what zone needs to be provided.

"rs", it's a boolean. Currently the value is true. I don't know yet what it is, but you can infer pretty easily it's value and data type by looking at the hex values in the 2nd message sent on the Unity client websocket connection.

"version", it's a utf string. is the current client version (so the version of the wasm code). Again pretty easy to figure out, it's in the 2nd message sent on the Unity client in clear text since it's a utf string.

those infos comes out of the /getUserInfo.php page on the website after logging in.
username is a utf string.
password is a utf string. it's the hashed password.
id is a long.