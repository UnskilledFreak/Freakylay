# Freakylay

A multi game overlay to display stats for streamers or other creators. It is focused mainly on rythm games but might fit to other genres as well.

**Double click somewhere on the page to open the options panel.**  
I added that here too because most people will not read everything in this ReadMe.

I kept the old info because of nostalgia and to have all of its versions listed, so basically the following info is still true for Freakylay Versions less than 3:
#### The old Info:
An alternative and customizable overlay for [DataPuller Mod](https://github.com/kOFReadie/DataPuller) which lets you choose your own style.  
It's based on the [original overlay by kOF.Readie](https://github.com/kOFReadie/BSDP-Overlay) with some tweaks and a completely new way of displaying scores, combo, player health, accuracy and much more!  
I am planning to implement HTTPStatus as well so the overlay would work with both mods :)

# Index:

- [Features](#Features)
- [Supported Games and Mods](#Games)
- [Version differences](#Differences)
- [Url and access](#Url)
- [Customizing](#Customizing)
- [Configuration](#Configuration)
- [List of Parameters](#Parameters)
- [HeartRate Implemenation](#HeartRate)
- [Older Versions](#Versions)
- [Known Issues](#Issues)
- [FAQ](#FAQ)
- [Translators](#Translators)
- [Special Thanks](#Testers)
- [Changelog](#changelog)

## Features

- supports multiple games and connection types
- change background and font color like you want, even with transparency
- supports long and short names for modifiers (Instant Fail / IF)
- if in practice mode, it displays the offset instead of the whole percentage (toggleable)
    - 130% => +30%
    - 80% => -20%
- displays accuracy, player health and time in a nice circular progressbar
- it hides itself when in menus
- flip elements independently
- test it with a preview image of Beat Saber without having the game to run
- [Pulsoid & HypeRate](#HeartRate) heart rate fully integrated to match style including a graph if you want that
- completely event-driven

## Games

**Supported Games and Mods**  
Freakylay supports multiple games and mods:
- Beat Saber
  - [DataPuller 2.0.12](https://github.com/ReadieFur/BSDataPuller/releases/tag/2.0.12)
  - [DataPuller 2.1.0+](https://github.com/ReadieFur/BSDataPuller)
  - [HttpStatus 1.20.0+](https://github.com/opl-/beatsaber-http-status)
  - [HttpSiraStatus 9.0.1+](https://github.com/denpadokei/HttpSiraStatus)
  - BeatSaberPlus: *I will **not** add support for BeatSaberPlus by HardCpp. I do not care if licencing and all of its legal stuff is sorted by now, it all started by copying (I would rather say stealing) other mods without permission and claiming to be done by himself which is just a no-go. I may be wrong but this is as far as I know. If I am wrong just tell me. If you want to use Freakylay with BeatSaberPlus implement the connection yourself. PR might be possible.*
- BoomBox
  - TODO: Data grabbing is possible from vanilla game, no need for mods yay :3
- Synth Riders
  - TODO: This is planed but im not sure yet.

## Differences

**Version differences**  
Version 1: Alpha/Beta versions where just my little own overlay version specifically written for my own use.
But others seemed to like it, so I decided to open it up a bit and released the first version to the public.

Version 2 was a more complex and feature heavy release cycle but thanks to me being lazy the code was practicable unreadable and not good for further development.

With that said, Version 3 was born. A complete rewrite which also added support for multiple games and different connection type like websocket or http.

## Url

It is hosted via HTTP, so you can use the LAN-IP feature too if you have separate machines for stream and game (and the connection supports it):

[http://u.unskilledfreak.zone/overlay/freakylay/latest/](http://u.unskilledfreak.zone/overlay/freakylay/latest/)

See [Configuration](#Configuration) for more options.

## Customizing

**Just double-click somewhere on the page!**

Use the opening options panel to customize the overlay like you want!
You can close the options panel simply by double-click somewhere else.

## Configuration

The option panel will generate the URL by itself. Copy the URL and insert it into something useful like OBS or other recording or streaming software.  
Since Version 3.0.0, the config in the URL is somewhat encrypted and cannot be changed easily. However, the URL parameters of version 2 are still working in version 3. 

## Parameters

With Freakylay Version 3 the way the configuration is stored and handled changed. But the old URL parameter style still works because it is used as a fallback and for initializing purposes.
However, it will display only the new style in the options panel.

Version 3:  
All parameters of Version 2 (see table bellow). Additional to version 2 table there is the new parameter `w` witch stored an encrypted config string. 

Version 2 URL parameters:

| Parameter | Info                                                                                                                 | DataPuller Version | Freakylay Version |
|-----------|----------------------------------------------------------------------------------------------------------------------|--------------------|-------------------|
| ip=\<ip\> | IP to connect to any game running DataPuller Mod in the local network, default is 127.0.0.1                          | 0.0.2              | 0.1.0             |
| a=color   | background color in rgba or hex                                                                                      | 0.0.2              | 0.1.0             |
| b=color   | text color in rgba or hex                                                                                            | 0.0.2              | 0.1.0             |
| c         | enable short modifier names (Instant Fail <-> IF)                                                                    | 0.0.2              | 0.1.0             |
| d         | show previous played BSR key if any                                                                                  | 0.0.2              | 0.1.0             |
| e         | hide miss counter                                                                                                    | 0.0.2              | 0.2.0             |
| f         | hide BPM                                                                                                             | 0.0.2              | 0.2.1             |
| g         | hide NJS                                                                                                             | 0.0.2              | 0.2.1             |
| h         | hide Combo                                                                                                           | 0.0.2              | 0.2.1             |
| i         | display song info on the right side, able to combine with top (o)                                                    | 0.0.2              | 0.3.0             |
| j         | display counter section at the top                                                                                   | 0.0.2              | 0.3.0             |
| k         | display modifiers on the right side                                                                                  | 0.0.2              | 0.2.0             |
| l         | hide the arrow next to the score, pointing up if a new high score or down if actual score is lower then previous one | 1.0.0              | 1.0.0             |
| m         | hide full combo as modifier, will get removed when full combo breaks                                                 | 1.0.0              | 1.1.0             |
| n         | show only current time to match other circular bar's style                                                           | 2.0.2              | 2.1.0             |
| o         | display song info on top, able to combine with flip (i)                                                              | 2.0.2              | 2.1.0             |
| p         | show default difficulty only when no custom difficulty exist                                                         | 2.0.2              | 2.1.0             |
| q         | hide all modifiers, overrides full combo (m) and modifier flip (k)                                                   | 2.0.2              | 2.1.0             |
| r         | Adds your Pulsoid Feed to the display bars                                                                           | 2.0.2              | 2.1.0             |
| s         | skips welcome splash screen                                                                                          | 2.0.2              | 2.1.0             |
| t         | hide complete counter section                                                                                        | 2.0.3              | 2.2.2             |
| u         | hide complete song info section                                                                                      | 2.0.3              | 2.2.2             |

## HeartRate
The implementation for heart rate supports Pulsoid and HypeRate. 

### Pulsoid
An always up-to-date list of _**supported devices**_ can be found at https://www.blog.pulsoid.net/monitors.  
There are nice of easy to follow tutorials at https://www.blog.pulsoid.net/.  

## Versions

Older versions of Freakylay are available via there tags inside the master branch. The tags are ~~based on the compatible DataPuller~~ basically the Overlay's Version at that time.
Every Version can be accessed by its version number as a subdirectory.

The latest stable version of this overlay can always be found at the `latest` subdirectory:  
[http://u.unskilledfreak.zone/overlay/freakylay/latest/](http://u.unskilledfreak.zone/overlay/freakylay/latest/)

It is possible to access unreleased or unstable versions by using its number in the URL. There is no guarantee that all Versions are available. Only those listed bellow will be always available.

| Freakylay Version        | State                 | Url                                                                                                            |
|--------------------------|-----------------------|----------------------------------------------------------------------------------------------------------------|
| 3.1.0                    | released              | [http://u.unskilledfreak.zone/overlay/freakylay/3.1.0/](http://u.unskilledfreak.zone/overlay/freakylay/3.1.0/) |
| 3.0.1                    | released              | [http://u.unskilledfreak.zone/overlay/freakylay/3.0.1/](http://u.unskilledfreak.zone/overlay/freakylay/3.0.1/) |
| 3.0.0                    | released              | [http://u.unskilledfreak.zone/overlay/freakylay/3.0.0/](http://u.unskilledfreak.zone/overlay/freakylay/3.0.0/) |
| 2.2.3 (DataPuller 2.0.9) | released              | [http://u.unskilledfreak.zone/overlay/freakylay/2.2.3/](http://u.unskilledfreak.zone/overlay/freakylay/2.2.3/) |
| 2.2.2 (DataPuller 2.0.3) | released              | [http://u.unskilledfreak.zone/overlay/freakylay/2.2.2/](http://u.unskilledfreak.zone/overlay/freakylay/2.2.2/) |
| 2.2.1 (DataPuller 2.0.3) | released              | [http://u.unskilledfreak.zone/overlay/freakylay/2.2.1/](http://u.unskilledfreak.zone/overlay/freakylay/2.2.1/) |
| 2.2.0 (DataPuller 2.0.3) | released              | [http://u.unskilledfreak.zone/overlay/freakylay/2.2.0/](http://u.unskilledfreak.zone/overlay/freakylay/2.2.0/) |
| 2.1.0 (DataPuller 2.0.3) | unreleased / unstable | [http://u.unskilledfreak.zone/overlay/freakylay/2.1.0/](http://u.unskilledfreak.zone/overlay/freakylay/2.1.0/) |
| 2.0.0 (DataPuller 2.0.2) | released              | [http://u.unskilledfreak.zone/overlay/freakylay/2.0.0/](http://u.unskilledfreak.zone/overlay/freakylay/2.0.0/) |
| 1.1.0 (DataPuller 1.2.1) | released              | [http://u.unskilledfreak.zone/overlay/freakylay/1.1.0/](http://u.unskilledfreak.zone/overlay/freakylay/1.1.0/) |

## Issues

**Known issues**
- when using DataPuller 2.1.0 or earlier, the miss counter is sometimes a few counts behind the actual value, this is a known bug from the mod. See [DataPuller Issue #26](https://github.com/ReadieFur/BSDataPuller/issues/26). Sadly I cannot do anything about it, there is already a workaround implemented, but this does not cover all the missing miss increments on the mod side.  
For most stability, use DataPuller 2.0.12 (which does not have the double-combo bug, only missing misses sometimes)

## FAQ

**Q:** Which type of colors can be used?  
**A:** Basically every possible color which is used in the web and there are more than 16 million of them.

**Q:** Why is there no DataPuller version since version 3 release?  
**A:** Because version 3 is not strictly written to DataPuller anymore. It supports other mods and games as well. However, it supports DataPuller from version 2.0.12.

**Q:** I can only see the overlay for a split second in my application, and then it goes away!  
**A:** This is a normal behaviour. The overlay will hide itself when you are in the menus. It will show everything you set it up to when you start playing a song.

**Q:** The overlay won't show anything even when I play a song!  
**A:** Make sure the overlay is set up correctly. Double-check the selected game and connection, especially correct version, and copy the URL to your application. Also check if your mods are up and running.

## Testers

Special thanks and much love to everyone who helped me on developing and testing:

- [Nini_Miautastisch](https://www.twitch.tv/nini_miautastisch)
- [Mr_Laubsauger](https://www.twitch.tv/mr_laubsauger)
- [Fefeland](https://www.twitch.tv/fefeland)

## Translators
Thank you so much for your work!
- chinese - [baoziii](https://github.com/baoziii/Freakylay)
- spanish - [Fefeland](https://www.twitch.tv/fefeland)
- english and german - UnskilledFreak

## Changelog
- 3.1.0
  - added chinese translation (thanks to [baoziii](https://github.com/baoziii/Freakylay))
  - added german translation
  - added spanish translation (thanks to [Fefeland](https://www.twitch.tv/fefeland))
  - fixed minor styling issues (thanks to [baoziii](https://github.com/baoziii/Freakylay))
  - fixed typos
  - fixed default health is now 50 instead of 0
  - fixed overlay not showing map when using Http(Sira)Status and loading the overlay while a map is played
  - removed Pulsoid JSON HeartRate type because they removed it as announced
- 3.0.1
  - fixed heart graph shows infinity when no heart rate was broadcasted
  - fixed song sub name not visible
- 3.0.0
  - completely rewritten but kept all features of version 2.2.3
  - added support for Http(Sira)Status 9.0.1+
  - added support for DataPuller 2.1.0
  - added BSR Key sync for Http(Sira)Status from Beat Saver
  - added generic multi game support
  - added generic connection types (Websocket / HTTP(s))
  - added Pulsoid Token API (Heart rate)
  - added HypeRate API (Heart rate)
  - added fully customizable heart rate graph
  - added color sync with HttpSiraStatus 9.0.1+
  - added rank info for DataPuller 2.0.12+
  - added disable option for heart circle bar
  - added margin setting for all elements
  - added toggleable animation on score increase
  - added more score compare options (DataPuller 2.0.12+ only) 
  - added random color generator
  - changed configuration storage and handling, still compatible with version 2.2.3 and bellow
  - tons of fixes and improvements
- 2.2.3
  - fixed timer offset when playing in practice mode
  - fixed `&` character in texts gets rendered ugly
- 2.2.2
  - added option to hide counter section
  - added option to hide song info
  - fixed url copy to clipboard
  - fixed typo in readme
- 2.2.1
  - fixed Pulsoid circle bar was always visible
- 2.2.0
  - added compatibility for DataPuller 2.0.3
  - added new modifiers
  - faster song / super fast song / slower song now only displays when modifier is set
  - Practice Mode now wont show faster or slower song modifiers
- 2.1.0 inDev
  - added splash screen
  - added Pulsoid feed
  - various bug fixes
  - styled options panel
  - this version never get its final release because Beat Saber 1.13.4 was released while developing 2.1.0
  - fixed faster/slower song disappearing when Practice Mode was set to low or high
- 2.0.0
  - updated to DataPuller 2.0.2
  - converted whole js part of this project to typescript
  - fixed all modifiers disappearing when full combo is lost
  - internal improvements on calculations
  - added minify to generated js file to improve loading speed
- 1.1.0
  - Updated to DataPuller 1.1.1
  - added Full Combo Modifier
  - added alpha check
  - added better support for 720p
  - improved performance
- prior to 1.1.0
  - sadly no notes where made, so I cannot say for sure what changes where done