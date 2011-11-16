describe("Jukebox", function() {
         
         describe("Services", function() {
                  var jukeboxServices;
                  
                  beforeEach(function() {
                             jukeboxServices = new Jukebox.Services();
                             url = 'http://jukebox-shawnobanion.dotcloud.com/clean/';
                             xmlhttp=new XMLHttpRequest();
                             xmlhttp.open("GET", url, false);
                             xmlhttp.send();
                             xmlDoc = xmlhttp.responseXML;
                             console.log(xmlDoc);
                             });
                  
                  afterEach(function() {
                             url = 'http://jukebox-shawnobanion.dotcloud.com/clean/';
                             xmlhttp=new XMLHttpRequest();
                             xmlhttp.open("GET", url, false);
                             xmlhttp.send();
                             xmlDoc = xmlhttp.responseXML;
                             console.log(xmlDoc);
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