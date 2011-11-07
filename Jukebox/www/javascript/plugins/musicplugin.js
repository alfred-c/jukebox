var MusicLibrary = function() {};

MusicLibrary.prototype.print = function (types, success, fail) {
    return PhoneGap.exec(success, fail, "jukebox.plugin.musiclibrary", "print", types);
};

MusicLibrary.prototype.selectSongs = function (types, success, fail) {
    return PhoneGap.exec(success, fail, "jukebox.plugin.musiclibrary", "selectSongs", types);
};

MusicLibrary.prototype.setupMusicPlayer = function (success, fail) {
    return PhoneGap.exec(success, fail, "jukebox.plugin.musiclibrary", "setupMusicPlayer", types);
};

MusicLibrary.prototype._castMediaItems = function(pluginResult) {
    var entries = pluginResult.message;
	var retVal = []; 
	for (i=0; i<entries.length; i++) {
		retVal.push(jQuery.parseJSON(entries[i]));
	}
    pluginResult.message = retVal;
    return pluginResult;    
}

PhoneGap.addConstructor(
    function() {
        if(!window.plugins) {
            window.plugins = {};
        }
        window.plugins.musicLibrary = new MusicLibrary();
});