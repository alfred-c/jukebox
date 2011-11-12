var Jukebox = Jukebox || {};

Jukebox.Event = function (eventName, songList, isBid) {
    this.name = eventName;
    this.songs = songList;
    if(isBid == "yes"){
        this.bidding = true;
    }
    else {
        this.bidding = false;
    }
};

/*Services
 *contains all functions and variables to contact with the server.
 */

Jukebox.Services = function () {
    this.root = 'http://jukebox-shawnobanion.dotcloud.com/';
    //console.log(this.root);
};

Jukebox.Services.prototype.defaultErrorHandler = function(error, xhr) {
    /*
    if(typeof xhr === undefined) {
        console.log(error);
    }
    else {
        //console.log(xhr);
        console.log("The server cannot be reached.");
    }
     */
    console.log(error);
};

Jukebox.Services.prototype.get = function (tail, onSuccess, onError) {
    var errorCallback = onError || this.defaultErrorHandler;
    var url = this.root + tail;
    console.log(url);
    var jqxhr = $.get(url, function(data) {
                      if(data == "404") {
                        errorCallback("an error occured at the server");
                      }
                      else{
                        onSuccess(data);
                      }
                      })
    .error(function() { errorCallback("The server cannot be reached"); });
};

Jukebox.Services.prototype.post = function (tail, postdata, onSuccess, onError) {
    var errorCallback = onError || this.defaultErrorHandler;
    var url = this.root + tail;
    console.log(url);
    var jqxhr = $.post(url, postdata, function(data) {
                      if(data == "404") {
                      errorCallback("an error occured at the server");
                      }
                      else{
                      onSuccess(data);
                      }
                      })
    .error(function() { errorCallback("The server cannot be reached"); });
};

Jukebox.Services.prototype.getEvents = function(callback, errorCallback) {
    /*
	$.get(this.root + 'event/list/', function(data) {
		  callback(data);		  
		  });
     */
    this.get('event/list/', function(data) {callback(data)}, errorCallback);
};

Jukebox.Services.prototype.getEventSongs = function(eventId, callback, errorCallback) {
    /*
	$.get(this.root + 'event/songs/' + eventId, function(data) {
		  callback(data, eventId);		  
		  });
     */
    this.get('event/songs/' + eventId, function(data) {callback(data, eventId);}, errorCallback);
};

Jukebox.Services.prototype.addEvent = function(event, callback, errorCallback) {
    /*
    //console.log('Hello');
    //console.log(root);
	var url = this.root+ 'event/create/';
	
    
	//SAMPLE EVENT:
	//event = {"name":"Tommy Nevin's Pub","songs":[{"persistentID":"7407864994792753601","title":"Also Sprach Zarathustra - Tone Poem For Large Orchestra, Op. 30: Introduction","albumTitle":"The 100 Most Essential Pieces of Classical Music","artist":"Southwest German Radio Symphony Orchestra & Ferdinand Leitner","albumArtist":"Various Artists","genre":"Classical","playbackDuration":"92.666","releaseDate":"2010-06-22 12:00:00 +0000"},{"persistentID":"17947838929277235736","title":"Always","albumTitle":"Extra's","artist":"Breaking Benjamin","albumArtist":"Breaking Benjamin","genre":"AlternRock","playbackDuration":"230.424","releaseDate":null},{"persistentID":"5486537098218507377","title":"The End","albumTitle":"The Black Parade","artist":"My Chemical Romance","albumArtist":"My Chemical Romance","genre":"Rock","playbackDuration":"112.979","releaseDate":null}]};
    
	//console.log(JSON.stringify(event));
	$.post(url,JSON.stringify(event), function(data){
		   // This returns the event ID
		   callback(data);
		   });
     */
    this.post('event/create/', JSON.stringify(event), function(data) {callback(data);}, errorCallback); 
};

Jukebox.Services.prototype.requestSong = function(songId, eventId, callback, errorCallback) {
    /*
	var url = this.root + 'event/enqueuesong/' + eventId + '/' + songId + '/' + device.uuid;
    //console.log(url);
	$.get(url, function(data) {
		  callback(data);		  
		  });
     */
    this.get('event/enqueuesong/' + eventId + '/' + songId + '/' + device.uuid, 
             function(data) {callback(data);},
             errorCallback);
};

Jukebox.Services.prototype.getQueue = function(eventId, callback, errorCallback) {
    /*
    var url = this.root+'event/queue/' + eventId;
	$.get(url, function(data) {
		  callback(data, eventId);		  
		  });
     */
    this.get('event/queue/' + eventId, function(data) {callback(data, eventId);}, errorCallback);
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
    var self = this;
    window.plugins.musicLibrary.setupMusicPlayer(
                                                 function (result){
                                                 console.log(result);
                                                        self.playFirstSong(eventId);                                          },
                                                 function (error) {
                                                 console.log(error);
                                                 }
                                                 );
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
                             //console.log(queue);
                             //console.log(queue[0]);
                             console.log(queue[0].song_id);
                             
                             window.plugins.musicLibrary.playSongWithId(
                                                                        queue[0].song_id,
                                                                        function (result){
                                                                        console.log(result);
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
