/* Author Bryce Wong (@dimmoro)
 * We assume that the string comes from a file, and it adheres to a strict format.  Thus are regex are  based on assumptions.
 */
function MeekLuaTableParser() {
}

//Even if there is only one table, we return it in an array.
MeekLuaTableParser.prototype.toJSON = function(str) {
	return JSON.parse(this.toJSONString(str));
}
MeekLuaTableParser.prototype.toJSONString = function(str) {
	str = this.handleMultipleTables(str); //String may have more than one table in them.
	//return str.replace(/--.+$/g, "").replace(/=/g, ":").replace(/[\[\]]/g,"").replace(/" :/g,'":').replace(/,\s*\n(\s*)}/g, "\n}");
	str = str.replace(/--.+$/g, "").replace(/=/g, ":");  //Remove comments and replace equal sign with colons.
	//str = str.replace(/[\[\]]/g,"");
	//str = str.replace(/(\[\d*\])/g,"\"$1\"");  //Replace digit Key brackets with quotes.
	str = str.replace(/(\[\d*\])/g,this.replaceDigitKeyBrackets);  //Replace digit Key brackets with quotes.
	str = str.replace(/\["/g,"\"").replace(/"\]/g,"\"");  //Remove [] around Keys.
	str = str.replace(/: (.*)/g,this.encloseNonDigitValuesWithQuotes);  //Enclose non digit Values with quotes.
	str = str.replace(/" :/g,'":'); //Remove extra space?
	str = str.replace(/,\s*\n(\s*)}/g, "\n}"); //Remove trailing commas.
	//str = str.replace(/\//g,"\/\/");  //Escape slashes.
	return '{'+str+'}';  //Wrap all tables.
}

//Enclose the table with curly brackets, and enclose the header with quotes.
//Handle commas between tables.
//All tables will be in an array; this is handled in another function.
MeekLuaTableParser.prototype.handleMultipleTables= function(str){
	//console.log(str.match(/[^|\n](.*)=\n/g));  //Locate Headers
	//console.log(str.match(/\n\}/g));  //Locate end of table
	str = str.replace(/([^|\n])(.*)(=\n)/g,this.encloseHeaders);  //Locate Headers
	str = str.replace(/\n\}/g,"\n},");  //Locate end of table
	str = str.replace(/,(?=[^,]*$)/, '');  //Chop last comma
	return str;
}
MeekLuaTableParser.prototype.encloseHeaders= function(match, p1, p2, p3, offset, string){
	//console.log(p1);console.log(p2);console.log(p3);
    p1 = p1.replace(/^\s+/, '');//Remove any leading spaces.
    //Remove any trailing spaces
	for (var i = p2.length - 1; i >= 0; i--) {
	    if (/\S/.test(p2.charAt(i))) {
	        p2 = p2.substring(0, i + 1);
	        break;
	    }
	}
	return '"'+p1+p2+'"'+p3;
}
MeekLuaTableParser.prototype.replaceDigitKeyBrackets= function(match, p1, offset, string){
	return p1.replace(/\[/,"\"").replace(/\]/,"\"");
}
MeekLuaTableParser.prototype.encloseNonDigitValuesWithQuotes= function(match, p1, offset, string){
	trim = p1.replace(/(^,)|(,$)/g, "")  //Locate comma, and remove it.
	//console.log(trim);
	if(trim.match(/"(.*?)"/)) return ': '+trim+',';  //Already enclosed in quotes, so put back comma.
	if (isNaN(trim)) {
		if(trim.match(/\[\[(.*?)\]\]/)) trim = trim.substring(2, trim.length-2);//ESO enclosed string values with double brackets.
		return ': "'+trim+'",';  //Enclose quotes, and put back comma.
	} else
		return ': '+p1;  //Comma is still there.
}