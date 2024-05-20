# Create Default-App

The quickest and easiest way to get started with web development. This CLI tool enables you to quickly start building a new web application, with everything set up for you. <br><br>
The interactive experience guides you through setting up your project.

#### To get started, use the following command:

```bash
npx create-default-app
```

Running `npx create-default-app` (with no arguments) launches an interactive experience that guides you through setting up a project.

You will be asked to enter the name of your project:

```bash
What is the name of your project?
[-] my-project
```

You will be asked to choose your CSS framework:

```bash
Which CSS framework do you want to use?
[-] none
[-] bootstrap
[-] tailwindcss
```

You will be asked to whether you want to initialise git:

```bash
Do you want to initialize git?
[-] yes
[-] no
```

The required dependencies will be installed and configured. No more hassle.<br>

#### Your project will already be bootstrapped and configured so you can get quickly into programming your dream project.

## Output

Running `npx create-default-app` will create a directory named as your project inside the current folder. Inside that directory, it will generate the initial project structure and install the transitive dependencies.

```bash
my-project
|
├── node_modules
├── package.json
├── index.html
├── style.css
└── app.js
```

No configuration or complicated folder structures, only the files you need to build your app. Once the installation is done, you can open your project folder:

```bash
cd my-project
```

For tailwindcss, you will have to run the following command in the terminal:

```bash
npx tailwindcss -i style.css -o output.css --watch
```
 This command is needed to compile the Tailwind CSS styles into regular CSS that the browser can understand.

 