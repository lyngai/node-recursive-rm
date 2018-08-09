## Recursive-rm

> Remove directories recursively like `rm -rf`.
> Use it like fs.

## Installation

```
npm install recursive-rm
# or
yarn add recursive-rm
```

## Usage

Import like fs.

### Without Promise

```
const rm = require('recursive-rm');

rm.removeDir(targetDir[, safeDelete=true[, restrictedDir=null[, callback]]])
```

### With Promise

```
const rm = require('recursive-rm').promises;

rm.removeDir(targetDir[, safeDelete=true[, restrictedDir=null]])
```

## Examples

### Safe Delete (Recommended)

```
/* use callback */
rm.removeDir(targetDir, /* safeDelete */true, restrictedDir, function (err) {
	/* callback */
	if (err) {
		console.error(err);
		return;
	}
	/* do something */
});

/* use Promise */
rm.removeDir(targetDir, /* safeDelete */true, restrictedDir)
  .then(() => {/* success */})
  .catch((err) => {/* failed */})
```

#### Note

Remove will be aborted under the safe delete mode when:
- A target directory path not starts with the given ```restrictedDir``` 
- A root path is given as target directory, like ```'C:\\'``` (windows) or ```'/'``` (\*nix)

### non-Safe mode

```
/* use callback */
rm.removeDir(targetDir, /* safeDelete */false, null, function (err) {
	/* callback */
	if (err) {
		console.error(err);
		return;
	}
	/* do something */
});

/* use Promise */
rm.removeDir(targetDir, /* safeDelete */false)
  .then(() => {/* success */})
  .catch((err) => {/* failed */})
```