# Maker's Edge Kiosk Software

Software to allow members to scan their name badges with a badge scanner to automatically check in. This software is intended to run on a Raspberry Pi

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

* [Node.JS](https://nodejs.org/en/)
* Electron

```
Give examples
```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Open Items

* Take ID number from badge scanner and compare to google spreadsheet of known members
  * Check if ID number matches any number in column of ID's
    * This may need to be logic in the spreadsheet: https://stackoverflow.com/questions/41943500/google-spreadsheet-api-v4-find-value
* If ID number matches one in the spreadsheet, need to somehow "check in" that member in the Mindbody software that maker's edge uses
* If ID number doesn't match one in the spreadsheet, display some kind of error message that notifies the user that they may not be a member

## Deployment

Add additional notes about how to deploy this on a live system

## Useful Links

* [Electron](https://electronjs.org/) - Allows for app creation
* [README Template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2) - Useful Readme template

## Authors

* **Elijah Escobedo** - *Initial work*
* **Jessica Escobedo** - *HTML and Graphic Design*
