describe("Jukebox", function() {
         

         describe("Services", function() {
                  var jukeboxServices;
                  
                  beforeEach(function() {
                             jukeboxServices = new Jukebox.Services(true);
                             });
                  
                  it("should be able to handle error", function() {
                     jukeboxServices.get('lostparadise/',
                                         function() {fail('lostparadise is supposed to be lost and should success');},
                                         function(error) {
                                         expect(error).toEqual("The server cannot be reached.");
                                         }
                                         );
                     });
                  
                  it("should be able to clean the database", function() { 
                     jukeboxServices.get('clean/', function(data) { expect(data).toBeDefined(); }, function(error) { fail(error); });
                     waits(1500);
                     });
                  
                  it("should get an empty list of events", function() {
                     jukeboxServices.getEvents(function(data) {
                                               expect(data.length).toEqual(0);
                                               },
                                               function(error) {
                                               fail(error);
                                               });
                     waits(1500);
                     });
                  
                  var eventId = null;
                  
                  it("should be able to create event and get event id back", function() {

                     var event = {"name":"Tommy Nevin's Pub","bidding":true ,"songs":[{"persistentID":"7407864994792753601","title":"Also Sprach Zarathustra - Tone Poem For Large Orchestra, Op. 30: Introduction","albumTitle":"The 100 Most Essential Pieces of Classical Music","artist":"Southwest German Radio Symphony Orchestra & Ferdinand Leitner","albumArtist":"Various Artists","genre":"Classical","playbackDuration":"92.666","releaseDate":"2010-06-22 12:00:00 +0000"},{"persistentID":"17947838929277235736","title":"Always","albumTitle":"Extra's","artist":"Breaking Benjamin","albumArtist":"Breaking Benjamin","genre":"AlternRock","playbackDuration":"230.424","releaseDate":null},{"persistentID":"5486537098218507377","title":"The End","albumTitle":"The Black Parade","artist":"My Chemical Romance","albumArtist":"My Chemical Romance","genre":"Rock","playbackDuration":"112.979","releaseDate":null}]};
                     
                     jukeboxServices.addEvent(event, function(data) {
                                                expect(data).toBeDefined();
                                                eventId = data;
                                                console.log(data);
                                              },
                                                function (error) {
                                                fail(error);
                                              });
                     
                     waits(1500);
                     
                     });
                  
                  it("should be able to get a list of events with the newly created event", function() {
                     jukeboxServices.getEvents(function(data) {
                                               expect(data.length).toEqual(1);
                                               expect(data[0]['id']).toEqual(eventId);
                                               },
                                               function(error) {
                                               fail(error);
                                               });
                     waits(1500);
                     });
                  
                  it("should be able to get the three songs for the newly created event", function() {
                     jukeboxServices.getEventSongs(eventId,
                                                   function(data) {
                                                   expect(data.length).toEqual(3);
                                                   },
                                                   function(error) {
                                                   fail(error);
                                                   });
                     waits(1500);
                     });
                  
                  it("should be able to get end the newly created event", function() {
                     jukeboxServices.endEvent(eventId,
                                                   function(data) {
                                                    expect(data).toBeDefined();
                                                   },
                                                   function(error) {
                                                    fail(error);
                                                   });
                     waits(1500);
                     });
                  
                  it("should get an empty list of events after ending the newly created event", function() {
                     jukeboxServices.getEvents(function(data) {
                                               expect(data.length).toEqual(0);
                                               },
                                               function(error) {
                                               fail(error);
                                               });
                     waits(1500);
                     });
                  
                  
                  });
         
         
         describe("DOM", function() {
                  var jukeboxDOM;
        
                  beforeEach(function() {
                             jukeboxDOM = new Jukebox.DOM();
                             });
         
                  describe("Format time interval tests", function () {
                           it("Should correctly parse seconds", function(){
                              expect(jukeboxDOM.formatTimeInterval(60)).toEqual('01:00');
                              expect(jukeboxDOM.formatTimeInterval(0)).toEqual('00:00');
                              expect(jukeboxDOM.formatTimeInterval(135)).toEqual('02:15');
                              });
                           });

                    });
         
         });