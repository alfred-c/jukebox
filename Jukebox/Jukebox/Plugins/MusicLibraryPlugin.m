//
//  MusicLibraryPlugin.m
//  Jukebox
//
//  Created by Thanapon Noraset on 11/4/11.
//  Copyright (c) 2011 __MyCompanyName__. All rights reserved.
//

#import "MusicLibraryPlugin.h"

@implementation MusicLibraryPlugin

@synthesize callbackID;
#pragma Utility Methods

-(NSString *) jsonStringFromPropertyValue:(NSObject *) object{
    if(object == nil) {
        return @"null";
    }
    else{
        return [NSString stringWithFormat:@"\"%@\"",object];
    }
}

-(NSString *) jsonStringFromMediaItem:(MPMediaItem *) item{
    NSString *jsonStr = [NSString stringWithFormat:@"{\"persistentID\":%@",[item valueForKey:MPMediaEntityPropertyPersistentID]];
    jsonStr = [jsonStr stringByAppendingFormat:@",\"title\":%@", 
               [self jsonStringFromPropertyValue:[item valueForKey:MPMediaItemPropertyTitle]]];
    jsonStr = [jsonStr stringByAppendingFormat:@",\"albumTitle\":%@", 
               [self jsonStringFromPropertyValue:[item valueForKey:MPMediaItemPropertyAlbumTitle]]];
    jsonStr = [jsonStr stringByAppendingFormat:@",\"artist\":%@", 
               [self jsonStringFromPropertyValue:[item valueForKey:MPMediaItemPropertyArtist]]];
    jsonStr = [jsonStr stringByAppendingFormat:@",\"albumArtist\":%@", 
               [self jsonStringFromPropertyValue:[item valueForKey:MPMediaItemPropertyAlbumArtist]]];
    jsonStr = [jsonStr stringByAppendingFormat:@",\"genre\":%@", 
               [self jsonStringFromPropertyValue:[item valueForKey:MPMediaItemPropertyGenre]]];
    jsonStr = [jsonStr stringByAppendingFormat:@",\"playbackDuration\":%@", 
               [self jsonStringFromPropertyValue:[item valueForKey:MPMediaItemPropertyPlaybackDuration]]];
    //in second
    //jsonStr = [jsonStr stringByAppendingFormat:@",\"artwork\":%@", 
    //           [item valueForKey:MPMediaItemPropertyArtwork]];
    //sending image thru json, need further research
    jsonStr = [jsonStr stringByAppendingFormat:@",\"releaseDate\":%@", 
               [self jsonStringFromPropertyValue:[item valueForKey:MPMediaItemPropertyReleaseDate]]];
    //jsonStr = [jsonStr stringByAppendingFormat:@",\"assetURL\":%@", 
    //           [(NSURL *)[item valueForKey:MPMediaItemPropertyAssetURL] absoluteString]];
    //getting assetURL outside AV Foundation Framework is not supported
    jsonStr = [jsonStr stringByAppendingFormat:@"}"];
    return jsonStr;
}

-(NSArray *) jsonArrayFromMediaCollection:(MPMediaItemCollection *) collection{
    NSMutableArray *itemArray = [NSMutableArray arrayWithCapacity:collection.count];
    for (MPMediaItem *item in collection.items) {
        [itemArray addObject:[self jsonStringFromMediaItem:item]];
    }
    //NSLog(@"%@", itemArray );
    return [NSArray arrayWithArray:itemArray];
}

#pragma Plugin Methods

-(void)print:(NSMutableArray*)arguments 
    withDict:(NSMutableDictionary*)options {
    
    //The first argument in the arguments parameter is the callbackID.
    //We use this to send data back to the successCallback or failureCallback
    //through PluginResult.   
    self.callbackID = [arguments pop];
    
    //Get the string that javascript sent us 
    NSString *stringObtainedFromJavascript = [arguments objectAtIndex:0];                 
    
    //Create the Message that we wish to send to the Javascript
    NSMutableString *stringToReturn = [NSMutableString stringWithString: @"StringReceived:"];
    //Append the received string to the string we plan to send out        
    [stringToReturn appendString: stringObtainedFromJavascript];
    
    //Create Plugin Result
    PluginResult* pluginResult = [PluginResult resultWithStatus:PGCommandStatus_OK messageAsString:                        [stringToReturn stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
    
    //Checking if the string received is HelloWorld or not
    if([stringObtainedFromJavascript isEqualToString:@"HelloWorld"]==YES){
        //Call  the Success Javascript function
        [self writeJavascript: [pluginResult toSuccessCallbackString:self.callbackID]];
    }
    else{    
        //Call  the Failure Javascript function
        [self writeJavascript: [pluginResult toErrorCallbackString:self.callbackID]];
    }
    
}

- (void) selectSongs:(NSMutableArray*)arguments 
            withDict:(NSMutableDictionary*)option{
    self.callbackID = [arguments pop];
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [appDelegate presentMediaPickerFor:self];
}

#pragma MediaPickerController Deletage Methods

- (void) mediaPicker: (MPMediaPickerController *) mediaPicker
   didPickMediaItems: (MPMediaItemCollection *) collection {
    
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [appDelegate dismissMediaPicker];
    @try{
        //return
        PluginResult* pluginResult = [PluginResult resultWithStatus:PGCommandStatus_OK 
                                                     messageAsArray:[self jsonArrayFromMediaCollection:collection]
                                                               cast:@"window.plugins.musicLibrary._castMediaItems"];
        [self writeJavascript:[pluginResult toSuccessCallbackString:self.callbackID]];
        //[self updatePlayerQueueWithMediaCollection: collection];
        //NSLog(@"What");
    }
    @catch (NSException *ex) {
        PluginResult* pluginResult = [PluginResult resultWithStatus:PGCommandStatus_OK messageAsString:                        [ex.name stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
        [self writeJavascript:[pluginResult toErrorCallbackString:self.callbackID]];
    }
}

- (void) mediaPickerDidCancel: (MPMediaPickerController *) mediaPicker {
    
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [appDelegate dismissMediaPicker];
}


@end
