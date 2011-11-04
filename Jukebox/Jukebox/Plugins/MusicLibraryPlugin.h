//
//  MusicLibraryPlugin.h
//  Jukebox
//
//  Created by Thanapon Noraset on 11/4/11.
//  Copyright (c) 2011 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <PhoneGap/PGPlugin.h>

@interface MusicLibraryPlugin : PGPlugin {
    NSString* callbackID;  
}

@property (nonatomic, copy) NSString* callbackID;

- (void) print:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
