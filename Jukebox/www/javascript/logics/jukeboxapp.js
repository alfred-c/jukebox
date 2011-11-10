var Jukebox = Jukebox || {};

Jukebox.Event = function (eventName, songList, isItFree) {
    this.name = eventName;
    this.songs = songList;
    this.isFree = isItFree;
};

/*Services
 *contains all functions and variables to contact with the server.
 */

Jukebox.Services = functions () {
    var root = 'http://jukebox-shawnobanion.dotcloud.com/';
};


Jukebox.Services.prototype.getEvents = function(callback) {
	$.get(root + 'event/list/', function(data) {
		  callback(data);		  
		  });
};

Jukebox.Services.prototype.getEventSongs = function(eventId, callback) {
	$.get(root + 'event/songs/' + eventId, function(data) {
		  callback(data, eventId);		  
		  });
};

Jukebox.Services.prototype.addEvent = function(event, callback) {
	var url = root+ 'event/create/';
	
    
	//SAMPLE EVENT:
	//event = {"name":"Tommy Nevin's Pub","songs":[{"persistentID":"7407864994792753601","title":"Also Sprach Zarathustra - Tone Poem For Large Orchestra, Op. 30: Introduction","albumTitle":"The 100 Most Essential Pieces of Classical Music","artist":"Southwest German Radio Symphony Orchestra & Ferdinand Leitner","albumArtist":"Various Artists","genre":"Classical","playbackDuration":"92.666","releaseDate":"2010-06-22 12:00:00 +0000"},{"persistentID":"17947838929277235736","title":"Always","albumTitle":"Extra's","artist":"Breaking Benjamin","albumArtist":"Breaking Benjamin","genre":"AlternRock","playbackDuration":"230.424","releaseDate":null},{"persistentID":"5486537098218507377","title":"The End","albumTitle":"The Black Parade","artist":"My Chemical Romance","albumArtist":"My Chemical Romance","genre":"Rock","playbackDuration":"112.979","releaseDate":null}]};
    
	//console.log(JSON.stringify(event));
	$.post(url,JSON.stringify(event), function(data){
		   // This returns the event ID
		   callback(data);
		   });
};

Jukebox.Services.prototype.requestSong = function(songId, eventId, callback) {
	url = root + 'event/enqueuesong/' + eventId + '/' + songId;
	$.get(url, function(data) {
		  callback(data);		  
		  });
};

Jukebox.Services.prototype.getQueue = function(eventId, callback) {
    var url = root+'event/queue/' + eventId;
    //console.log(url);
	$.get(url, function(data) {
		  callback(data, eventId);		  
		  });
};


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


/*Player
 *contains all functions for controlling music player
 */

Jukebox.Player = function() {};
Jukebox.Player.prototype.startPlayer = function(eventId) {
    this.playFirstSong(eventId);
};

Jukebox.Player.prototype.playFirstSong = function(eventId) {
    var jukeboxServices = new Jukebox.Services();
    var self = this;
    jukeboxServices.getQueue(eventId,
                         function(queue, eventId) {
                            if(queue.length <= 0) {
                                console.log("No queue");
                                setTimeout(function() {self.playFirstSong(eventId)},10000);
                                return false;
                            }
                            else{
                         console.log("There is an item");
                                window.plugins.musicLibrary.setupMusicPlayer(
                                    function (result){
                                        console.log(result);
                                        window.plugins.musicLibrary.playSongWithId(
                                            queue[0],
                                            function (result){
                                                console.log(result);
                                            },
                                            function (error) {
                                                console.log(error);
                                            }
                                        );
                                    },
                                function (error) {
                                    console.log(error);
                                }
                            );
                         }
                         return true;
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
	html += '<li data-theme="c" class="ui-btn ui-btn-up-c ui-btn-icon-right ui-li-has-arrow ui-li"><div class="ui-btn-inner ui-li"><div class="ui-btn-text">';
	html += '<a href="#" onclick="clickSong(\'' + song.persistentID + '\', \'' + eventId + '\');" class="ui-link-inherit">';
	//html += '<img src="css/jquery/images/album-bb.jpg" class="ui-li-thumb">';
	html += '<h3 class="ui-li-heading">' + song.title + '</h3>';
	html += '<p class="ui-li-desc">' + song.albumTitle + ' - ' + song.artist + ' (' + this.formatTimeInterval(parseInt(song.playbackDuration)) + ')</p>';
	html += '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';
	return html
};
