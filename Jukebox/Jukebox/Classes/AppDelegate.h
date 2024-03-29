//
//  AppDelegate.h
//  Jukebox
//
//  Created by Thanapon Noraset on 10/30/11.
//  Copyright __MyCompanyName__ 2011. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <MediaPlayer/MediaPlayer.h>
#ifdef PHONEGAP_FRAMEWORK
	#import <PhoneGap/PhoneGapDelegate.h>
#else
	#import "PhoneGapDelegate.h"
#endif

@interface AppDelegate : PhoneGapDelegate {

	NSString* invokeString;
    MPMusicPlayerController* appMusicPlayer;
}

// invoke string is passed to your app on launch, this is only valid if you 
// edit Jukebox.plist to add a protocol
// a simple tutorial can be found here : 
// http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html

@property (copy)  NSString* invokeString;
@property (nonatomic, retain) MPMusicPlayerController* appMusicPlayer;

- (void) presentMediaPickerFor:(id<MPMediaPickerControllerDelegate>) inDelegate;
- (void) dismissMediaPicker;

- (void) setupMediaPlayer;
- (void) terminateMediaPlayer;
@end

