# TODO-List-Web-App
---
# Installation Guide

## Create an .env file and copy-paste the below text after you download the project
SECRET=Something secret to encrypt our session

## 1. Install Required softwares

+ [click to install "git"](https://git-scm.com/downloads)
+ [click to install "WinRAR"](https://www.win-rar.com/download.html?&L=0)
+ [Click to install "VSCode Studio"](https://code.visualstudio.com/download)
+ [Click to install "Node.js"](https://nodejs.org/en/download/)
+ Click to install "MongoDB Community Server"
[Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/) [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/) [Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) [MacOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
<br/>

## 2. Two methds to install the web application in your system:

### I. Clone the github repository in your system.
+ Create a new folder in your system with any name.
+ Open the folder and right click in the folder.
+ Select the **git bash here** option from the drop down.
+ Go to the github repository.
+ Click on **Code** at the top left of the github repository present in **green** color.
+ Copy the link of the github repository.
+ Go to the **git terminal** and use the command **git clone https://github.com/akashmarwaha1/ENSE-374--GROUP-PROJECT-TEAM-GUINAN.git**.
+ Open the folder in VSCode Studio and follow **Steps 3, 4 and 5**.

### II. Download the zip file.
+ Click on the **Code** present in green color in the github repository.
+ Click on **Download ZIP** option from the dropdown.
+ Go to the downloaded zip file and extract the contents using a zip file extractor like **WinRAR**.
+ Open the folder in VSCode Studio and follow **Steps 3, 4 and 5**.
<br/>

---

## 3. Run MongoDB in your system.
+ Open two Windows PowerShell terminals as Admin and type the following commands in them.
```powershell
mongod
```
```powershell
mongo
```
#### Note for Windows:
#### If the above commands do not work, follow the steps below:
##### 1. **Make an Alias file:**  
Open powershell and open your powershell profile:
```powershell
notepad $profile
```
If you get an error that the path doesn’t exist, then you can create it with:
```powershell
New-item -Path $profile -ItemType File -Force
```
Then attempt to open the file again.
Now paste in:
```powershell
Set-Alias mongod "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
Set-Alias mongo "C:\Program Files\MongoDB\Server\5.0\bin\mongo.exe"
```
**Change the path of mongod and mongo if installed someplace other than C:/ drive** 
<br/>
Save, close, and restart powershell.
<br/>

**If you get text warning that you can’t run scripts, you will need to:**

Open a powershell as an administrator
Run the following:
```powershell
Set-ExecutionPolicy Unrestricted
```
Restart all powershell instances

---
##### 2. **Create a data directory**

create the folders:
```
c:/data
```
and
```
c:/data/db
```
This is where your databases will be stored.

Check it is working with:
```powershell
mongo --version
```
---

## 4. Open Vscode command line.
Install all the dependencies using given command:
```powershell
npm install express ejs mongoose passport passport-local passport-local-mongoose express-session dotenv
``` 
---

## 5. Running the web application:
### Two methods for running the webapp.
#### 1. Run the webapp using nodejs command:
```powershell
node app.js
```
Open the below link in your web browser:
```powershell
localhost:3000
```
<br/>

#### 2. Run the webapp using nodemon.
##### Install nodemon using the command in VScode Terminal:
```powershell
npm i -g nodemon
```
#### After installing nodemon,use the command:
```powershell
nodemon
```
Open the below link in your web browser:
```powershell
localhost:3000
```
(-g is used to install nodemon globally into the system)
<br/>

---
