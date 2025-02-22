# group39
How to start the project:
##### 1. Create a python virtual environment
On Unix
```Bash
python -m venv .venv
```
On Windows
```Bash
python -m venv C:\path\to\new\virtual\environment

PS C:\> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

##### 2. Start the virtual environment
"\<venv>" refers to the relative path to your venv folder
On Unix
```Bash
source <venv>/bin/activate
```
On Windows
```Bash
PS C:\> <venv>\Scripts\Activate.ps1
```

##### 3. Install dependencies
Make sure you are in the venv by seeing (venv) on your command line
```Bash
pip install -r requirements.txt
```

##### 4. Set your .env file
```Bash
cp .env.example .env
```
Then replace the dummy api key with the real one

##### 5. Run the program
```Bash
python graph.py
```