# Project Title: SafeGrip

## Overview

"SafeGrip" is a rock climbing safety gear tracker that helps users manage and monitor the expiration dates of their climbing equipment. By allowing users to log gear purchases, select usage frequency, and specify whether the gear was used outdoors or indoors, the app calculates when each item will expire. It then provides links to purchase new gear, and stores this data securely in the user’s account for easy access and management.

### Problem Space

"SafeGrip" is needed because rock climbing gear has specific lifespans, and using expired or worn-out equipment can be dangerous. As an active member in the rock climbing community, I notice that many climbers forget to track the age or condition of their gear, especially with various factors like outdoor exposure or frequency of use impacting its durability. Currently, there are no streamlined solutions to track the expiration of each piece of gear individually and provide alerts when it’s time to replace it. By helping climbers stay on top of maintenance and expiration dates, my app ensures safety and offers convenience, preventing accidents and promoting responsible gear management.

### User Profile

The primary users of your app will be rock climbers of all levels. This includes individuals who climb for recreation, competitive climbers, outdoor adventurers, or professionals working in climbing gyms.

Users will add gear to their profile, track expiration, and in the future - receive expiration alerts.

### Features

- Add Gear
- Gear Condition Tracking (Frequency)
- Expiration Date Calculation Outputed 
- Purchase Link for Expired Gear
- View Gear Information
- Remove Gear from List

### Tech Stack

Front-End:
- React.js with react-router-dom for navigation.
- Sass for styling, using BEM naming conventions.
- Axios for API requests

Back-End:
- Node.js with Express
- CORS

Packages:
- npm install: vite, axios, sass, cors

### APIs

No external sources of data will be used in my app, as I will create my own API. 

### Sitemap

1. Home Page: A form to add a new piece of gear to the user’s profile, specifying gear details - like type, purchase date, usage frequency
2. My Gear Page: A detailed page for each piece of gear added, showing all data, usage tracking, and expiration date.

### Data

Gear.json
  gear: Name of the gear (e.g., Harness, Rope, Nylon Sling)
  purchase_date: Date of purchase
  usage_frequency: How often the gear is used
  purchase_link: Link to purchase new gear (external)
  expiration_date: Calcualted date the gear is expected to expire

User.json
  Posted "gearData": 
    { gear, puchase_date, usage_frequency, expiry_date, purchase_link } 

### Endpoints

- GET: "/gear"
- GET: "/gear/:gear"
- GET: "/gear/:gear/purchase_date"
- GET: "/gear/:gear/usage_frequency"
- GET: "/gear/:gear/purchase_link"
- GET: "/gear/:gear/expiry_date"
- POST: "/gear/:gear/expiry_date"
- POST: "/gear/:gear/purchase_link"

- GET: "/user"
- GET: "/user/UserGear"
- POST: "/user/submit"
- DELETE: "/user/deleteGear"


## Future Implementations
- Notifications sent to the user for timely reminder of upcoming gear expiriation dates
- More gear items added to the functionality
- User Authentication
- Adding indoor/outdoor usage to the calcualtion, as outdoor usage speeds up expiration date


## Repositories
- Backend: https://github.com/olivianoell/SafeGrip-api.git
- Frontend: https://github.com/olivianoell/SafeGrip.git
