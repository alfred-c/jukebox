describe("PhoneGap API Tests", function() {
         
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