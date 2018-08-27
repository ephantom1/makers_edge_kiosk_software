# Maker's Edge Kiosk Software

Software to allow members to scan their name badges with a badge scanner to automatically check in. This software is intended to run on a Raspberry Pi, but should work on any operating system

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

* [Node.JS](https://nodejs.org/en/)
* [Google Sheets API for Node.JS](https://developers.google.com/sheets/api/quickstart/nodejs)
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

* Clean up how the functions are called in the main.js file
* Figure out how to check in a member in the MindBody service, the API costs money and not sure if checking in a member is possible in the api
  * May be able to use this to just input the ID number into the sign-in web page: http://nemo.js.org/
* Pass the member's name to the "Access Granted" page

## Deployment

Add additional notes about how to deploy this on a live system

## Useful Links

* [Electron](https://electronjs.org/) - Allows for app creation
* [README Template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2) - Useful Readme template

## Authors

* **Elijah Escobedo** - *Initial work*
* **Jessica Escobedo** - *HTML and Graphic Design*
