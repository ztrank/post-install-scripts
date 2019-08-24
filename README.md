# post-install-scripts
Provides utility scripts for Running Post Install actions.

## Installation
```npm install --save @trankzachary/post-install-scripts```

## Use
Create a file that will handle running the pipeline.
I recommend: 

`<project-root>/scripts/post.install.ts`

This file needs to create a new instance of any of the Utils that the pipeline script requires, then running the pipeline.

### Example
```typescript
import { SetJsonDefaults, Bind } from '@trankzachary/post-install-scripts';
import { Container } from 'inversify';
import { AppConfigDefaults, WebConfigDefaults, MachineConfigDefaults } from '../path/to/defaults';

const container = new Container();
Bind(container)
    .register(container, SetJsonDefaults, false, 'app.config.json')
    .register(container, SetJsonDefaults, false, 'web.config.json')
    .register(container, SetJsonDefaults, false, 'machine.config.json')
    .run(container)
    .subscribe(() => {});
```

### tsconfig.json
Add the file, or files, for your scripts to your project's `include` value.

```javascript
    ...
    "include": [
        "src/**/*.ts",
        "scripts/**/*.ts"
    ],
    ...
```

### package.json
Add the script in the scripts section.

```javascript
    ...
    "scripts": {
        ...
        "postinstall": "node ./dist/scripts/post.install.js",
        ...
    }
```
