# Video Calling Django Channels and WebRTC [![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
# Hi, I'm Abdul Rehman! 👋
![Anurag's GitHub stats](https://github-readme-stats.vercel.app/api?username=abrehman90&hide=contribs,prs&count_private=true&show_icons=true&theme=dark)


#### CAUTION: THIS REPOSITORY IS STILL UNDER DEVELOPMENT AND TESTING! SOME ISSUES STILL NEED TO BE RESOLVED!

#### Description:
 This project was made for learning how to Django Channels, signal, WebRTC SDPs, Websocket working.

## Tech Stack
**Server:** Django, JavaScript, Websocket, Channels  
 ## Features

- User enter the other user name 
- User enter the name then both create peer to peer connection
- Second User see profile and name how calling
- User accept or decline the call 
- User accept the call then on their camera
- Both User can mute their video or audio
- Both User disconnect the call 

####Installation: 
Go to your desired folder.
Run the command:
```bash
   git clone https://github.com/abrehman90/Video-Calling-Django-Channels-and-WebRTC.git
```
After clone or Download the repo now create the virtual environment

Run the command:
```bash
  python -m venv venv
```

After a venv directory is created, run the command for 
##### windows: venv\Scripts\activate.bat 
##### Unix or MacOS: source venv/bin/activate

##### Ensure latest version of pip by running: 
  
```bash
  python -m pip install --upgrade pip
```
Install the dependencies by running the command:

```bash
  pip install -r requirements.txt
```
We need multiple devices in the same LAN for testing. For that we need to make our localhost public. For that, download ngrok from https://ngrok.com/download and install it.

To start the development server, run the command:
```bash
  python manage.py runserver
```
For testing on multiple devices in the same LAN, go to the directory where you have installed ngrok. Run the command: ngrok.exe http 8000 This will make our localhost public and provide two public URLs. However, make sure to always use the one that starts with https: and not http: as we will be accessing media devices.

ngrok are running now change your Allow Host in settings.py

On local device, go to http://127.0.0.1:8000/ On other devices, go to the URL from ngrok that starts with https:.

## Authors
- [@abrehman90](https://github.com/abrehman90)

### Some Screenshot for this Project

![127 0 0 1_8000_(BlackBerry Z30)](https://user-images.githubusercontent.com/79878896/147876872-65d36330-6857-471c-863a-0a1bd704bcc6.png)

![127 0 0 1_8000_video_(BlackBerry Z30)](https://user-images.githubusercontent.com/79878896/147876879-5d5d1751-ab5f-440f-8977-e25249a1971a.png)

![127 0 0 1_8000_(BlackBerry Z30) (1)](https://user-images.githubusercontent.com/79878896/147876897-daa464aa-f3e0-400f-ad8b-9b340d0eb705.png)

![127 0 0 1_8000_video_(BlackBerry Z30) (1)](https://user-images.githubusercontent.com/79878896/147876902-bda6a3a3-f862-4ed9-aacb-24227ae83e17.png)

![127 0 0 1_8000_video_](https://user-images.githubusercontent.com/79878896/147876911-e65cadc2-3ee3-4d4a-ba17-174c5b76f261.png)

![127 0 0 1_8000_ (1)](https://user-images.githubusercontent.com/79878896/147876926-e86236b5-512f-44e0-a6d6-599997bba103.png)

![127 0 0 1_8000_video_ (1)](https://user-images.githubusercontent.com/79878896/147876943-7bc5459d-35f0-42d7-af2e-0ca59c2a6125.png)

![127 0 0 1_8000_ (2)](https://user-images.githubusercontent.com/79878896/147876946-fb99b7d0-28cc-44a8-bf02-28d4943f166f.png)

### Thanks for Reading...

## Happy Coading!!!

