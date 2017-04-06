export default {
  "guides": {
    "components-and-actions": "# Components and Actions\n\nLet's start making our `conference-speakers` component more interactive.\n\n```js\n// my-app/src/ui/components/conference-speakers/component.js\nimport Component, { tracked } from \"@glimmer/component\";\n\nexport default class ConferenceSpeakers extends Component {\n  @tracked current = 0;\n  speakers = ['Tom', 'Yehuda', 'Ed'];\n\n  @tracked('current')\n  get currentlySpeaking() {\n    return this.speakers[this.current];\n  }\n\n  @tracked('current')\n  get moreSpeakers() {\n    return (this.speakers.length - 1) > this.current;\n  }\n\n  next() {\n    this.current = this.current + 1;\n  }\n}\n```\n\n```hbs\n{{!-- my-app/src/ui/components/conference-speakers/template.hbs --}}\n<div>\n  <p>Speaking: {{currentlySpeaking}}</p>\n  <ul>\n    {{#each speakers key=\"@index\" as |speaker|}}\n      <li>{{speaker}}</li>\n    {{/each}}\n  </ul>\n\n  {{#if moreSpeakers}}\n    <button onclick={{action next}}>Next</button>\n  {{else}}\n    <p>All finished!</p>\n  {{/if}}\n</div>\n```\n\nIn the template above, we add the use of both the `{{if}}`/`{{else}}` and `{{action}}` helpers and reference several new internal component properties that we've added.\n\nWe're using the `{{action}}` helper to call our `next()` method/event handler to advance our current location in the speaker array (also known as our component's \"state\")\n\nBut there are two \"interesting\" syntax wrinkles in the component that may be unfamiliar.  We use the ES2015 `get` in front of our `currentlySpeaking()` method to define another property for our template (`{{currentlySpeaking}}`).\n\nAnd we use `@tracked` notations in two different ways. First, we are adding it to our `current` property and then we use it again differently above `currentlySpeaking` and `moreSpeakers` (`@tracked('current')`). What's going on there?\n\nThese \"annotations\", known as decorators, are a relatively new feature of Javascript.  In Glimmer they are used to track which of our properties change (so that Glimmer will watch for changes to those properties).\n\nBecause Glimmer watches for changes to `current` and then knows which values we want updated if it changes (due to our `@tracked('current')` annotation), it can quickly and efficiently re-compute the values for `currentlySpeaking` and `moreSpeakers` and update those locations in our template.\n\n## Lifecycle Hooks\n\nGlimmer components also provide \"lifecycle\" hooks that allow us to respond to changes to a component, such as when it gets created, rendered, updated or destroyed. To add a lifecycle hook to a component, implement the hook as a method on your component subclass.\n\nFor example, to be notified when Glimmer has rendered your component so you can attach a legacy jQuery plugin, implement the `didInsertElement()` method:\n\n```js\nimport Component from '@glimmer/component';\n\nexport default class extends Component {\n  didInsertElement() {\n    $(this.element).pickadate();\n  }\n}\n```\n",
    "filesystem-layout": "# File System Layout\n\nNow that we're up and running, let's take a look at how things are setup. Here's what our brand-new `my-app` currently looks like:\n\n```sh\nmy-app\n├── config\n│   └── environment.js\n├── dist/\n├── src\n│   ├── config\n│   │   ├── module-map.ts\n│   │   └── resolver-configuration.ts\n│   ├── ui\n│   │   ├── components\n│   │   │   └── my-app\n│   │   │       ├── component.ts\n│   │   │       └── template.hbs\n│   │   ├── styles\n│   │   │   └── app.css\n│   │   └── index.html\n│   ├── index.ts\n│   └── main.ts\n├── ember-cli-build.js\n│\n... other files ...\n```\n\nBriefly, those files and folders are:\n\n- `my-app/config/environment.js`: the base Glimmer config file\n- `my-app/dist`: your built files end up here\n- `my-app/src/config/*`: configuration files to keep Typescript happy. *Note: Glimmer only runs in Typescript at the moment. We aim to quickly add ES2015 Javascript support as well.*\n- `my-app/src/index.ts`: used to do initial app config before our Glimmer app boots (the div ID Glimmer renders into is set here (see the `containerElement` variable)\n- `my-app/ember-cli-build.js`: used to configure Ember-CLI in various ways (importing vendor files, Broccoli options, etc.)\n\nHowever, where we'll spend most of our time is in the `my-app/src/ui` folder.\n\n## The UI folder\n\nAs you can see, Glimmer puts all our components in the `my-app/src/ui/components` folder with the `my-app` component being where our app logic really begins. All other logic and components should be referenced in the `my-app/template.hbs` file (and we can nest them as deeply as we desire).\n\nSo let's add a new component in Glimmer. To do so, we'll run the following command to generate an initial blueprint for a component:\n\n```sh\n$ ember g glimmer-component hello-glimmer\ninstalling component\n  create src/ui/components/hello-glimmer/component.ts\n  create src/ui/components/hello-glimmer/template.hbs\n```\n\nAs you can see, we generate two files (`component.ts` and `template.hbs`) in the newly created `src/ui/components/hello-glimmer` folder. A Glimmer component uses a template to generate all our HTML (using a [Handlebars](http://handlebarsjs.com) template with Glimmer/Ember additions) and a Typescript/Javascript file that provides additional properties and event handlers (known as actions) to our template. We'll cover more details about how Handlebars works on subsequent pages.\n\nAll other components will also live in `src/ui/components` unless we deliberately nest them. So for example, if we add a second component called `conference-speakers`:\n\n```sh\n$ ember g glimmer-component conference-speakers\ninstalling component\n  create src/ui/components/conference-speakers/component.ts\n  create src/ui/components/conference-speakers/template.hbs\n```\n\nwe will see our new `conference-speakers` component added to our UI folder:\n\n```sh\nmy-app\n│\n... snipped ...\n\n└── src\n    └── ui\n        ├── components\n        │   ├── conference-speakers\n        │   │   ├── component.ts\n        │   │   └── template.hbs\n        │   └── hello-glimmer\n        │       ├── component.ts\n        │       └── template.hbs\n        ├── styles\n        │   └── app.css\n        └── index.html\n\n... snipped ...\n```\nThis then allows us to use that component as a top-level component in our `my-app/template.hbs` file:\n\n```hbs\n<conference-speakers />\n```\nBut we can also add sub-components to our app to nest those components more deeply in our folder tree. Let's generate one more component:\n\n```sh\n$ ember g glimmer-component conference-speakers/conference-speaker\ninstalling component\n  create src/ui/components/conference-speakers/conference-speaker/component.ts\n  create src/ui/components/conference-speakers/conference-speaker/template.hbs\n```\n\nThis generates our component inside our `conference-speakers` folder:\n\n```sh\nmy-app\n│\n... snipped ...\n\n└── src\n    └── ui\n        └── components\n            └── conference-speakers\n                ├── conference-speaker\n                │   ├── component.ts\n                │   └── template.hbs\n                ├── component.ts\n                └── template.hbs\n\n... snipped ...\n```\nOur new component then is only useable from inside our `conference-speakers/template.hbs` file:\n\n```hbs\n<conference-speaker />\n```\n\nGlimmer uses a \"local resolution\" with nested components where the following syntax will not work in our main component (`my-app/template.hbs`):\n\n```hbs\n{{!-- invalid --}}\n<conference-speakers/conference-speaker />\n```\n\nMore details on the \"local resolution\" strategy will be posted shortly.\n\n## Styles\n\nDepending on where you are using your Glimmer app, your containing apps styles will already be affecting the look of your app. However, you can also add new styles that only apply to your Glimmer components by editing `src/ui/styles/app.css`\n",
    "getting-started": "# Getting Started\n\nNow that we've got Ember-CLI installed, let's go ahead and\ncreate a new app:\n\n```bash\n$ ember new my-app -b @glimmer/blueprint\ninstalling blueprint\n  create README.md\n  create config/environment.js\n  create ember-cli-build.js\n  create .gitignore\n  create package.json\n  create src/config/module-map.ts\n  create src/config/resolver-configuration.ts\n  create src/index.ts\n  create src/main.ts\n  create src/ui/components/my-app/component.ts\n  create src/ui/components/my-app/template.hbs\n  create src/ui/index.html\n  create tmp/.metadata_never_index\n  create tsconfig.json\n  create yarn.lock\nYarn: Installed dependencies\nSuccessfully initialized git.\n```\n\nAt this point, let's change into the directory (`cd my-app`), start the development server (`ember s`) and we're ready to begin.\n",
    "installing": "# Installing\n\nGlimmer uses [Ember CLI](https://ember-cli.com/), the battle-tested command-line interface tool (CLI) from the Ember project, to help you create and manage your applications.\nIt provides the following features, among others:\n\n* Creating a new application with a conventional project layout\n* A build pipeline with testing, development, and production environments\n* [TypeScript](http://www.typescriptlang.org/) support out-of-the-box\n* Generators for components and helpers\n\n## Pre-requisites\n\n### Git\n\nEmber CLI requires Git to manage many of its dependencies. Git comes with Mac OS X and most Linux distributions. Windows users can download and run <a href=\"http://git-scm.com/download/win\">this Git installer</a>.\n\n### Node.js and npm\n\nEmber CLI is built with JavaScript, and expects the [Node.js](https://nodejs.org/)\nruntime. It also requires dependencies fetched via [npm](https://www.npmjs.com/). npm is packaged with Node.js, so if your computer has Node.js\ninstalled you are ready to go.\n\nEmber requires Node.js 4 or higher and npm 2.14.2 or higher.\nIf you're not sure whether you have Node.js or the right version, run this on your\ncommand line:\n\n```bash\nnode --version\nnpm --version\n```\n\nIf you get a *\"command not found\"* error or an outdated version for Node:\n\n* Windows or Mac users can download and run [this Node.js installer](http://nodejs.org/download/).\n* Mac users often prefer to install Node using [Homebrew](http://brew.sh/). After\ninstalling Homebrew, run `brew install node` to install Node.js.\n* Linux users can use [this guide for Node.js installation on Linux](https://nodejs.org/en/download/package-manager/).\n\nIf you get an outdated version of npm, run `npm install -g npm`.\n\n### Yarn\n\nWe are going to use [Yarn](https://yarnpkg.com/en/) to manage dependencies in a Glimmer project, as it offers some advantages over npm, such as deterministic builds and the ability to work offline.\n\nYou can follow their <a href=\"https://yarnpkg.com/en/docs/install\">installation instructions</a> to get set up.\n\n## Installing\n\nTo generate new projects, we will need an experimental feature that is only available in the Canary release channel.\n\nTo install Ember CLI Canary, run the following command to install it from the `master` branch on GitHub:\n\n```bash\nyarn global add ember-cli/ember-cli\n```\n\nAlternatively, you can do:\n\n```bash\nnpm install -g ember-cli/ember-cli\n```\n\nTo verify that it's correctly installed, run the following command:\n\n```bash\nember -v\n```\n\nYou should see a version number with `beta`. Don't worry, this should be correct! Ember CLI doesn't have the concept of Canary versions, so it will show the latest beta release.\n",
    "templates-and-helpers": "# Templates and Helpers\n\nNow that we've setup a few components, let's discuss how our templates work in more detail.\n\n## Data for Templates\n\nComponents have two different kinds of data, or state, that can be displayed in templates:\n\n- Arguments\n- Properties\n\nArguments are data that we pass in to a component from its parent component. For example, if we have a `conference-speaker` component, we can pass it a `name` and `status` to use:\n\n```hbs\n<conference-speaker @name=\"Tom\" @status=\"Speaking\" />\n```\n\nInside our `conference-speaker` template, we can access the `@name` and `@status` arguments that we've been given:\n\n```hbs\n{{@name}} is {{@status}}\n```\n\nThose arguments are also available inside our components:\n\n```js\nconsole.log(this.args.name); // prints \"Tom\"\n```\n\nProperties, on the other hand, are internal to the component and declared in the class. We can use properties to store data that we want to show in the template, or pass to another component as an argument.\n\n```js\nimport Component from '@glimmer/component';\n\nexport default class ConferenceSpeaker extends Component {\n  user = {\n    name: 'Robbie'\n  };\n}\n```\n\nIn the above example, we've defined a component with a `user` property that contains an object with its own `name` property.\n\nWe can render that property in our template:\n\n```hbs\nHello, {{user.name}}!\n```\n\nWe can also take that property and pass it as an argument to the conference-speaker component we defined before:\n\n```hbs\n<conference-speaker @name={{user.name}} />\n```\n\n## Arguments vs. Properties\n\nRemember, arguments are data that was given to your component by its parent component, and properties are data your component has defined for itself.\n\nYou can tell the difference between arguments and properties in templates because arguments always start with an @ sign (think \"A is for arguments\"):\n\n```hbs\n{{@firstName}}\n```\n\nWe know that `@firstName` came from the parent component, not the current component, because it starts with @ and is therefore an argument.\n\nOn the other hand, if we see:\n\n```hbs\n{{name}}\n```\n\nWe know that name is a property on the component. If we want to know where the data is coming from, we can go look at our component class to find out.\n\nInside the component itself, arguments always show up inside the component's `args` property. For example, if `{{@firstName}}` is Tom in the template, inside the component `this.args.firstName` would also be Tom.\n\n## A Simple Loop\n\nAs mentioned earlier, Glimmer uses [Handlebars](http://handlebarsjs.com) as its template language. In addition to simple property references as shown above, it also allows us to setup loops, conditionals and event handlers.\n\nLet's start with a simple loop over an array:\n\n```js\nimport Component, { tracked } from \"@glimmer/component\";\n\nexport default class ConferenceSpeakers extends Component {\n  speakers = ['Tom', 'Yehuda', 'Ed'];\n}\n```\n\n```hbs\n<ul>\n  {{#each speakers key=\"@index\" as |speaker|}}\n    <li>{{speaker}}</li>\n  {{/each}}\n</ul>\n```\n\nUsing the `{{each}}` helper, we loop over our speakers array and then make the current value available as `speaker`. In the Glimmer VM, an array needs to be keyed on a unique value of some kind (in this case the array `@index`) so that the VM properly tracks value updates.\n\nThese types of simple templates are quite handy, but they become\nfar more powerful once we add event handling and conditionals. Let's keep going.\n",
    "tracked-properties": "# Change Tracking with Tracked Properties\n\nIn this guide, we'll take an in-depth look at how Glimmer keeps track of changes you make to\nyour components, and ensures they always stay up-to-date in the DOM.\n\nThe fundamental way Glimmer detects changes is through _tracked properties_.\nTracked properties are just like normal properties on your component, but with a\nspecial annotation that lets Glimmer know when you've changed it.\n\nLet's take a look at a simple component that welcomes our user. First, we'll\nwrite it _without_ tracked properties.\n\n```ts\nimport Component from '@glimmer/component';\n\nexport default class extends Component {\n  person = {\n    firstName: \"Tom\",\n    lastName: \"Dale\"\n  };\n}\n```\n\n```hbs\n<div>\n  Hello, {{person.firstName}} {{person.lastName}}!\n</div>\n```\n\nThis will render the following output:\n\n```html\n<div>\n  Hello, Tom Dale!\n</div>\n```\n\nAs you can see, Glimmer has rendered the person's first and last name. Because the data we want to render is static and doesn't change, we did not have to use a tracked property. That leads us to the first rule of tracked properties.\n\n**Rule #1**: Static, immutable data doesn't require you to do anything special. If the data you're rendering is available when the component is created and doesn't change, it does not need to be tracked.\n\nLet's say that we want to update our component to fetch data about the person over the network, instead of hardcoding it. We'll use `fetch` to grab some JSON and render it:\n\n**Note**: To get async/await to work you must create your project with the ```--web-component``` option, or add ```@glimmer/web-component``` to your **package.json**.\n\n```ts\nimport Component from '@glimmer/component';\n\nexport default class extends Component {\n  person: any;\n\n  constructor(options) {\n    super(options);\n    this.loadPerson();\n  }\n\n  async loadPerson() {\n    let request = await fetch('https://api.example.com/person.json');\n    let json = await request.json();\n    this.person = json.person;\n  }\n}\n```\n\n```hbs\n<div>\n  Hello, {{person.firstName}} {{person.lastName}}!\n</div>\n```\n\nUnlike our first version, this component will throw an exception when we set the `person` property:\n\n```\nUncaught Error: The 'person' property on the person-viewer component was changed after it had been rendered. Properties that change after being rendered must be tracked. Use the @tracked decorator to mark this as a tracked property.\n```\n\nWhy did this happen?\n\nTo optimize initial rendering performance, component properties are **immutable\nby default**. Glimmer skips setting up expensive change tracking on properties\nthat might never change.\n\nIf a property can change after a component is rendered, you must tell Glimmer\nthat it should do additional bookkeeping to detect property changes and\nautomatically update the DOM.\n\nWe call these properties _tracked properties_. Instead of clunky methods like\n`set()` or `setState()`, just use the `@tracked`\n[decorator](https://github.com/tc39/proposal-decorators) to hint to the Glimmer\nVM that a property can change.\n\n**Rule #2**: If you change a component's property after it has rendered (such as\nwhen data is fetched asynchronously), that property must be marked with the\n`@tracked` decorator.\n\nWe can get our earlier example working again by indicating that the `person`\nproperty is tracked:\n\n```ts\nimport Component, { tracked } from '@glimmer/component';\n\nexport default class extends Component {\n  @tracked\n  person: any;\n\n  constructor(options) {\n    super(options);\n    this.loadPerson();\n  }\n\n  async loadPerson() {\n    let request = await fetch('https://api.example.com/person.json');\n    let json = await request.json();\n    this.person = json.person;\n  }\n}\n```\n\nNotice that we are now also importing `tracked` from the `@glimmer/component` package.\n\nNow our component updates as soon as the JSON request comes back, without any\nerrors. As you can see, because we made `person` a tracked property, Glimmer\nknows to update the component when you set it using normal JavaScript syntax.\n\n## The Immutable Pattern\n\nTo write maintainable, understandable components, we recommend that you embrace the\nImmutable Pattern:\n\n1. Save component state as an \"atom\" in a tracked property on the component.\n2. To change state, replace the root \"atom\" with a new copy of the state.\n\nThis approach helps you make a component's state changes predictable: you know\nthat a component can only be updated when that root tracked property changes.\nJavaScript destructuring syntax can make this quite elegant:\n\n```ts\nimport Component, { tracked } from \"@glimmer/component\";\n\nexport default class extends Component {\n  @tracked state = {\n    firstName: \"Lady\",\n    lastName: \"Zahra\"\n  }\n\n  setUserFirstName(firstName) {\n    this.state = {\n      ...this.state,\n      firstName\n    }\n  }\n}\n```\n\nBy adopting the Immutable Pattern, your component state will be clear and deterministic,\nreducing bugs and helping you ship features faster.\n\n## Why Tracked Properties?\n\nTo understand the performance benefits of Glimmer's tracked property\narchitecture, it's important to understand the current state of the art of most\nother JavaScript component libraries.\n\nBroadly speaking, most component libraries have taken one of two approaches:\n\n1. Fine-grained property observation, like Ember 1.x.\n2. Virtual DOM diffing, like React.\n\nSystems that rely on property observation trade reduced initial render\nperformance for improved updating speed. That's because they must install\nobservers on every property that gets rendered into the DOM, which takes time.\nBut if a property changes, updates to the DOM are very targeted and fast.\n\nHowever, web users expect pages to render near instantly. Setting up observers\nadds a lot of overhead, which slows down initial render. Virtual DOM-based libraries\nlike React have become very popular, because they prioritize raw render speed by\nkeeping change-tracking bookkeeping to a minimum.\n\nThe tradeoff is that updates require re-evaluating the component tree to figure\nout how the DOM needs to be mutated. Essentially, that means doing a full render\npass on a component and all of its children every time a property changes.\n\nWhile constructing virtual DOM is fast and applying diff updates can be\noptimized, it's far from instanteous, particularly as the size of your\napplication grows. [As your virtual DOM-based app grows, you will have to do\nmore work to make sure it stays\nperformant.](https://marmelab.com/blog/2017/02/06/react-is-slow-react-is-fast.html).\n\nThe best weapon for optimizing a virtual DOM-based library is something like\nReact's `shouldComponentUpdate` hook, which lets you quickly tell React that a\ncomponent hasn't changed and thus you can bypass constructing the virtual DOM\ntree entirely.\n\nGlimmer's key insight is that the rendering engine's primitive should be the\n_value_, not the component. Because of this architecture, Glimmer in essence\nconstructs a component's optimized `shouldComponentUpdate` hook automatically,\nwithout any effort on your part.\n\nHow does this work? Internally, Glimmer maintains a monotonically increasing\nglobal revision counter. As it renders each property in a template, if that\nproperty is marked as tracked, it notes the current revision count.\n\nWhen you set a tracked property, Glimmer does two things under the hood:\n\n1. It increments the global revision counter and sets the property's revision to\n   the new value.\n2. It tells Glimmer to revalidate the render tree.\n\nRevalidating the render tree means that Glimmer walks through every tracked property it had\nseen on the previous render and checks to see if it had been updated.\n\nThis might seem like a very bad, slow idea! However, remember that Glimmer uses\nintegers to track changes. Modern JavaScript VMs like V8 contain optimized fast\npaths for integer comparisons, of which a modern CPU can do millions without\nbreaking a sweat. The number of comparisons needed is bounded by how many\ntracked properties you have in DOM, so this scan of the render tree is\nsurprisingly fast.\n\nSo how does Glimmer accomplish the automatic `shouldComponentUpdate()`? Because\nevery input into a component is either immutable or a tracked property, it just\nlooks at the revision counter of each input value. If none of them are greater\nthan the last render, the entire component can be bypassed.\n",
    "using-glimmer-as-web-components": "# Using Glimmer as Web Components\n\nIn addition to using Glimmer for a widget on one section on a page, you can also use Glimmer components as web components. Let's do another new app setup. Instead of doing an installation like we did originally, we'll now run the following command:\n\n```sh\nember new display-tile -b @glimmer/blueprint --web-component\n```\n\nWhen we add the `--web-component` flag, we reconfigure our app to expose our `display-tile` component as a Web Component to browsers. That in turn allows us to render markup like the following from a backend:\n\n```hbs\n<display-tile />\n```\nOnce we add our `app.js` file to the page, our browser will automatically load our Glimmer component into the DOM using the options provided by the backend and will boot each Glimmer app.\n\nFor more information about web components, browser support and various polyfills to enable broader support, please see:\n\n- [https://www.webcomponents.org/introduction](https://www.webcomponents.org/introduction)\n- [https://www.webcomponents.org/polyfills](https://www.webcomponents.org/polyfills)\n- [http://jonrimmer.github.io/are-we-componentized-yet/](http://jonrimmer.github.io/are-we-componentized-yet/)\n\n*Note* You cannot currently pass arguments to top-level Glimmer components due to technical limitations. We are working on removing this restriction.\n"
  }
}