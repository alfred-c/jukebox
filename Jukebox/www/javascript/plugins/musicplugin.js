MusicLibrary = function() {};

MusicLibrary.prototype.print = function (types, success, fail) {
    return PhoneGap.exec(success, fail, "jukebox.plugin.musiclibrary", "print", types);
};