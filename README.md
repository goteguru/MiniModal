# Mini Modal

Minimal async modal functionality for simple apps.
You can await for a form input or

## minimal API

* create modal windows from html templates
* open modal and await for it in async functions or modules
* alternatively, listen to `submitModal` or `cancelModal` messages
* generate async Exception on cancel event (or just ignore it)

The blocker div class called `.modal-background` if you want to style it.

```
.modal-background { background-color: rgb(10,10,10,0.6) }
```

## Usage:

import in modules:
```
import { Modal } from './modal.js'
```

Create modal content from template and call it multiple times:
```
const modalForm = new Modal('#form-template')
... do things ...
const input = await modalForm.open()
... process input ...
const input2 = await modalForm.open()
```

Template can contain style :
```
<template id="form-template">
	<form class="modal-window">
		<div class="modal-submit" name="esc">×</div>
		<label for="question">Question:</label>
		<input type="input" id="question" name="Question" value="some-default">
		<div class="modal-buttonrow">
			<button type="submit" name="button" value="1">yes</button>
		</div>
	</form>
	<style>
		.modal-submit { margin:0; display: block; width: 20px; height: 20px; position:absolute; top:0; right:0; cursor:pointer;}
		.modal-buttonrow { bottom:0; left:0; width:100%}
	</style>
</template>
```
