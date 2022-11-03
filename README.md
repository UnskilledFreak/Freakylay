# Freakylay

A multi game overlay to display stats for streamers or other creators. It is focused mainly on rythm games but might fit to other genres as well.

**Double click somewhere on the page to open the options panel.**  
I added that here too because most will not read everything in this ReadMe.

The old Info:  
I kept it because of nostalgia and to have all of its versions listed, so basically the following info is still true for Freakylay Versions less than 3:  
~~An alternative and customizable overlay for [DataPuller Mod](https://github.com/kOFReadie/DataPuller) which lets you choose your own style.~~  
~~Its based on the [original overlay by kOF.Readie](https://github.com/kOFReadie/BSDP-Overlay) with some tweaks and a completely new way of displaying scores, combo, player health, accuracy and much
more!~~  
~~I am planning to implement HTTPStatus as well so the overlay would work with both mods :)~~

# Index:

- [Features](#Features)
- [Supported Games and Mods](#Supported games and mods)
- [Version differences](#Version differences)
- [Url and access](#Url)
- [Customizing](#Customizing)
- [Configuration](#Configuration)
- [List of Parameters](#Parameters)
- [Older Versions](#Versions)
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
- Pulsoid heart rate fully integrated to match style

## Supported games and mods
Freakylay supports multiple games and mods:
- Beat Saber
  - [DataPuller 2.0.12+](https://github.com/ReadieFur/BSDataPuller)
  - [HttpStatus 1.20.0+](https://github.com/opl-/beatsaber-http-status)
  - [HttpSiraStatus 8.0.1+](https://github.com/denpadokei/HttpSiraStatus)
  - *I will **not** add support for BeatSaberPlus by HardCpp. I do not care if licencing and all of its legal stuff is sorted by now, it all started by copying (I would rather say stealing) other mods without permission which is just a no go. If you want to use Freakylay with BeatSaberPlus then you have to add support for it by yourself. PR might be possible.*
- BoomBox
  - Data grabbing is possible from vanilla game, no need for mods yay :3

## Version differences

Alpha/Beta versions where just my little own overlay version specifically written for my own use.
But others seemed to like it, so I decided to open it up a bit and released the first version to the public.

Version 2 was a more complex and feature heavy release cycle but thanks to me being lazy the code was practicable unreadable and not good for further development.

With that said, Version 3 was born. A complete rewrite which also added support for multiple games and different connection type like websocket or http.

## Url

It is hosted via HTTP so you can use the LAN-IP feature too if you have separate machines for stream and game:

[http://u.unskilledfreak.zone/overlay/freakylay/latest/](http://u.unskilledfreak.zone/overlay/freakylay/latest/)

See [Configuration](#Configuration) for more options.

## Customizing

**Just double-click somewhere on the page!**

Use the opening options panel to customize the overlay like you want!
You can close the options panel simply by double-click somewhere else.

## Configuration

The option panel will generate the URL by itself. Copy the URL and insert it into something useful like OBS or other recording or streaming software.

## Parameters

With Freakylay Version 3 the way the configuration is stored and handled changed. But the old URL parameter style still works because it is used as a fallback and for initializing purposes.
However, it will display only the new style in the options panel.

Version 3:  
-TODO-

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

## Versions

Older versions of Freakylay are available via there tags inside the master branch. The tags are ~~based on the compatible DataPuller~~ basically the Overlay's Version at that time.
Every Version can be accessed by its version number as a subdirectory.

The latest version of this overlay can always be found at the `latest` subdirectory:
[http://u.unskilledfreak.zone/overlay/freakylay/latest/](http://u.unskilledfreak.zone/overlay/freakylay/latest/)

| Freakylay Version | DataPuller Version | Url                                                                                                                                    |
|-------------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| 3.0.0             | 2.0.12+            | [http://u.unskilledfreak.zone/overlay/freakylay/3.0.0/](http://u.unskilledfreak.zone/overlay/freakylay/3.0.0/)                         |
| 2.2.3             | 2.0.9              | [http://u.unskilledfreak.zone/overlay/freakylay/2.2.3/](http://u.unskilledfreak.zone/overlay/freakylay/2.2.3/)                         |
| 2.2.2             | 2.0.3              | [http://u.unskilledfreak.zone/overlay/freakylay/2.2.2/](http://u.unskilledfreak.zone/overlay/freakylay/2.2.2/)                         |
| 2.2.1             | 2.0.3              | [http://u.unskilledfreak.zone/overlay/freakylay/2.2.1/](http://u.unskilledfreak.zone/overlay/freakylay/2.2.1/)                         |
| 2.2.0             | 2.0.3              | [http://u.unskilledfreak.zone/overlay/freakylay/2.2.0/](http://u.unskilledfreak.zone/overlay/freakylay/2.2.0/)                         |
| 2.1.0             | 2.0.2              | [http://u.unskilledfreak.zone/overlay/freakylay/2.1.0/ - unstable & unfinished](http://u.unskilledfreak.zone/overlay/freakylay/2.1.0/) |
| 2.0.0             | 2.0.2              | [http://u.unskilledfreak.zone/overlay/freakylay/2.0.0/](http://u.unskilledfreak.zone/overlay/freakylay/2.0.0/)                         |
| 1.1.0             | 1.1.1              | [http://u.unskilledfreak.zone/overlay/freakylay/1.1.0/](http://u.unskilledfreak.zone/overlay/freakylay/1.1.0/)                         |

## FAQ

Which type of colors can be used?  
Basically every possible color which is used in the web. Internally, the overlay uses RGB(a) scheme, but it should work with HSL/HSV as well.

Why is there **N/A** for DataPuller version since version 3 release?  
Because version 3 is not strictly written to DataPuller anymore, it supports HTTPStatus as well.

## Changelog
- 3.0.0
  - completely rewritten
  - added multi game support
  - added different connection types
  - fully integrated Pulsoid with OAuth2
  - changed configuration storage and handling
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