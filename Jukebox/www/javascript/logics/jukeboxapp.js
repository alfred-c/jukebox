var Jukebox = Jukebox || {};

/*Utilities
 *
 */

Jukebox.Utilities = function () {};
Jukebox.Utilities.prototype.addSong = function (song, songList) {
    for(var i = 0; i < songList.length; i++)
        if(songList[i].persistentID == song.persistentID)
            return false;
    songList.push(song);
    return true;
};

Jukebox.Utilities.prototype.getEvents = function(callback) {
	$.get('http://jukebox-shawnobanion.dotcloud.com/event/list/', function(data) {
		  callback(data);		  
		  });
};

/*DOM object
 *contains all functions for rendering html interface from data
 */
Jukebox.DOM = function() {};
Jukebox.DOM.prototype.renderListMediaItems = function(items) {
    if(items.length <= 0) {
        return '';
    }
    var html = '';
	for (i in items) {
		html += this.renderListMediaItem(items[i]);
	}
    html += '</ul>';
	return html;
};

Jukebox.DOM.prototype.renderListMediaItem = function(item) {
    var html = '<li class="ui-li ui-li-static ui-body-c" id="'+ item.persistentID +'">'
    html += '<p class="ui-li-aside ui-li-desc"><strong>'+this.formatTimeInterval(item.playbackDuration)+'</strong></p>';
    html += '<h3>'+item.title+'</h3>';
    html += '<p>' + item.albumTitle + ' - ' + item.artist + '</p>';
    html += '</li>';
    return html;
};

Jukebox.DOM.prototype.formatTimeInterval = function(seconds) {
    return (new Date).clearTime()
                     .addSeconds(seconds)
                     .toString('mm:ss');
};

Jukebox.DOM.prototype.renderEventListItems = function(events) {
	html = '';
	for (i in events) {
		html += this.renderEventListItem(events[i]);
	}		
	return html;
};

Jukebox.DOM.prototype.renderEventListItem = function(event) {
    var html = '';
	html += '<li data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-down-c ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#controls" class="ui-link-inherit">';
	html += '<h3 class="ui-li-heading">' + event.name + '</h3>';
	html += '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';
    return html;
};
