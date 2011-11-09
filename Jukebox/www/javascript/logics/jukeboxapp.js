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

Jukebox.Utilities.prototype.getEventSongs = function(eventId, callback) {
	$.get('http://jukebox-shawnobanion.dotcloud.com/event/songs/' + eventId, function(data) {
		  callback(data, eventId);		  
		  });
};

Jukebox.Utilities.prototype.addEvent = function(event, callback) {
	var url = 'http://jukebox-shawnobanion.dotcloud.com/event/create/';
	
	/*
	SAMPLE EVENT:
	var event = {"name":"Test Event","songs":[{"persistentID":"7407864994792753601","title":"Also Sprach Zarathustra - Tone Poem For Large Orchestra, Op. 30: Introduction","albumTitle":"The 100 Most Essential Pieces of Classical Music","artist":"Southwest German Radio Symphony Orchestra & Ferdinand Leitner","albumArtist":"Various Artists","genre":"Classical","playbackDuration":"92.666","releaseDate":"2010-06-22 12:00:00 +0000"},{"persistentID":"17947838929277235736","title":"Always","albumTitle":"Extra's","artist":"Breaking Benjamin","albumArtist":"Breaking Benjamin","genre":"AlternRock","playbackDuration":"230.424","releaseDate":null},{"persistentID":"5486537098218507377","title":"The End","albumTitle":"The Black Parade","artist":"My Chemical Romance","albumArtist":"My Chemical Romance","genre":"Rock","playbackDuration":"112.979","releaseDate":null}]};
	*/
	
	$.post(url,JSON.stringify(event), function(data){
		   // Successfully added
		   callback(true);
		   });
};

Jukebox.Utilities.prototype.requestSong = function(songId, eventId, callback) {
	url = 'http://jukebox-shawnobanion.dotcloud.com/event/enqueuesong/' + eventId + '/' + songId;
	$.get(url, function(data) {
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
	html += '<li data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-down-c ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a onclick="getSongs(\'' + event.id + '\');" href="#controls" class="ui-link-inherit">';
	html += '<h3 class="ui-li-heading">' + event.name + '</h3>';
	html += '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';
    return html;
};

Jukebox.DOM.prototype.renderSongListItems = function(songs, eventId) {
	html = '';
	for (i in songs) {
		html += this.renderSongListItem(songs[i], eventId);
	}		
	return html;
};

Jukebox.DOM.prototype.renderSongListItem = function(song, eventId) {
    var html = '';
	html += '<li data-theme="c" class="ui-btn ui-btn-up-c ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb"><div class="ui-btn-inner ui-li"><div class="ui-btn-text">';
	html += '<a href="#" onclick="clickSong(\'' + song.persistentID + '\', \'' + eventId + '\');" class="ui-link-inherit">';
	html += '<img src="css/jquery/images/album-bb.jpg" class="ui-li-thumb">';
	html += '<h3 class="ui-li-heading">' + song.title + '</h3>';
	html += '<p class="ui-li-desc">' + song.artist + '</p>';
	html += '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';
	return html
};
