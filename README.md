# hass-home-remote
Homekit style webapp for homeassistant to control your home

Quick demo can be found here: https://www.youtube.com/watch?v=Z4MTEIxxOHk

# Installation

Make a new folder in the www directory and give it a name that you want. This directory will soon be the URL on which you can use the frontend.
Copy the files from the `dist` folder to this folder. You can now go to [YOUR HASS URL] / local / [FOLDER NAME THAT YOU GAVE IT] to use the front end.

If no configuration has yet been loaded you will go to the settings page in the application. You must create a folder in your www folder and in this folder a file with the name `configuration.json` in this file you will define the pages and entities to be displayed in the application.
In the applications settingspage you can put the url to the configuration.json file or by default the file is downloaded from the folder `home_remote` so you can use home_remote as the name of the folder.

Now you can set the home assistant url in the settingspage of the application and use the download button to download the configuration to the application. Now use the refresh button and you will see that the bottom bar will be filled with the pages you defined in your configuration you can now switch to your pages and the application will connect to your home assistant. It will redirect to your HASS installation and you need to login to give it authentication, or you can use a long lived token to give it access (this is a setting on the settingspage).

# Configur the configuration.json file

Below you can see an example file of my own. I put comments after the lines to explain what it means and what every line is used for.

```
[  //Open an array every object in the array define 1 page on the application
  
  { // Open tag of the object / page
      "name": "Lampen",  // Name of the page
      "icon": "lightbulb", // Icon of the page shown in bottom tab bar (mdi icons)
      "content": [ // Opening Content
        {  // Here you define the content / tiles that will be shown on the page it is an array. Every object in the array is an set of tiles
          "name": "Lichtstrip", // Set the title of the set
          "entities": [ // Define the entities to be used. It is an array with array in it. Every array is an row of tiles
            [ // Opening tag of the row
              {
                "type": "light",  // Set the type of the entity (switch, input_boolean, binary_sensor, sensor, media_player, camera (work in progress))
                "entity": "light.woonkamer", // Give full entity
                "name": "Lichtstrip woonkamer", // Set friendly name
                "icon": "led-strip-variant", // Set icon
                "brightness": true // If it is a light with brightness add this line
              },
            ] // Closing tag of the row
          ] // Closing tag entities
        }, // Close set of entities
        {
          "name": "Demo",
          "entities": [
            [
                {
                  "type": "light",
                  "entity": "light.beganegrond",
                  "name": "Lichtstrip",
                  "icon": "led-strip-variant",
                  "brightness": true,
                  "scenes": [   // For lights with colors you can add scenes that will show a colored circle to active the scene on the brightness pop-up
                      {
                          "scene": "scene.ontspannen",
                          "name": "ontspannen",
                          "color": "#FDCA64"
                      },
                      {
                          "scene": "scene.helder",
                          "name": "helder",
                          "color": "#FFE7C0"
                      },
                      {
                          "scene": "scene.concentreren",
                          "name": "concentreren",
                          "color": "#BBEEF3"
                      },
                      {
                          "scene": "scene.energie",
                          "name": "energie",
                          "color": "#8BCBDD"
                      }
                  ]
                },
                {
                  "type": "sensor",
                  "entity": "sensor.battery_level",
                  "name": "Ipad batterij",
                  "icon": "battery-90",
                  "color": "green"
                },
                {
                  "type": "binary_sensor, sensor",
                  "entity": "binary_sensor.voordeur",
                  "name": "Voordeur",
                  "icon": "door-closed"
                },
                {
                  "type": "input_boolean",
                  "entity": "input_boolean.notify_sensor",
                  "name": "Notify sensors",
                  "icon": "door-closed"
                },
                {
                  "type": "switch",
                  "entity": "switch.doorbell_chime",
                  "name": "Deurbel uit",
                  "icon": "alarm-bell"
                },
                {
                  "type": "media_player",
                  "entity": "media_player.keuken",
                  "name": "Keuken",
                  "icon": {
                      "playing": "play-circle-outline",
                      "paused": "stop-circle-outline"
                    },
                  "group": { // If you have sonos you can add the group setting for grouping options in the media_player pop-up
                        "media_player.woonkamer": "Woonkamer",
                        "media_player.slaapkamer": "Slaapkamer"
                    }
                },
                { // This is work in progress
                  "type": "camera",
                  "entity": "camera.camera",
                  "name": "Camera",
                  "icon": "cctv"
                }
            ]
          ]
        }
      ] //Closing tag content
    } // Closing tag of the object / page
]
```

The first tab / page in the frontend can have a different view, it is like a homepage it's the starting point and can show more information than a default page if you want.
- It can show the weather
- Show how much entities are on/in use
- Can display today/tomorrows calendar events
- And you can define custom rules for messages/notes (they are a kind of notifications)

To show these things you must add some json to the first tab/page you put in your configuration.json file
Below is an example and I have commented again.

```
[
    {
		"name": "Home",
		"type": "home",  // Add a type value with the value home
		"title": "Street 1", // Give this page a title like your adress or just home
		"icon": "home",
		"weather": "weather.weersverwachting", // If you wanna show the weather set the weather entity here (Background of the app changes based on day/night and sun/cloudy)
		"calendar": "calendar.calendar_entity", // If you have your calendar synced set the entity here
		"unusedEntitiesForStats": [ // For showing for example how much lights are on it is usefull to set this list with entities you don't want it to count, like groups will also count as a light that is on so it won't show the right number.
		    "light.discoagroup",
		    "light.the_voice_group_1",
		    "light.the_voice_group_2",
		    "light.discoagroupodd",
		    "light.discoagroupeven",
		    "light.the_voice_group_0",
		    "light.the_voice_group_3",
		    "light.group_for_wakeup",
		    "light.beganegrond",
		    "light.zithoek"
		],
		"notes": [ // You can set rule that when they are true a message will be shown on the home of your app. I use it for when to put my garbage out on the street.
		    {
		        "entity": "sensor.blink_pmd", // Define the entity it should check it state
		        "conditions": [ // Define one or more conditions you wanna check for
		            {
		                "type": "contains", // How do you wanna check you got 'contains' or 'equals'
    		            "check": "tomorrow", // In this example i'm checking if the state contains the word "tomorrow"
    		            "list": "tomorrow", // The message can be added to 3 lists today, tomorrow or other
    		            "message": "Morgen plastic aan de straat" // If the condition is true it show this message
		            },
		            {
    		            "type": "contains",
    		            "check": "today",
    		            "list": "today",
    		            "message": "Vandaag plastic aan de straat"
		            }
	            ]
		    },
		],
    "content": ......(Here comes the default config)
```
