MeekLuaTableParser.js converts a LUA file into a JSON object.
The js object does not include any file loading, but only simple string handling.
We neither determine table types, objects, etc., nor validate values.

We have included MeekArtisan.html as an example.
It requires an internet connection, as it uses jQuery and jQuery-ui from the Google repository.
Because browsers prevent loading files (cross origin errors,) because of security, we use jQuery to open and load a file.

We use the javascript function console.log() to help debug and test, please comment these out if they are causing errors.