export function Modal(tpl, { exception=false, interactive=true } = {}) {
	const template = document.querySelector(tpl)
	if (!template) throw new Error(`Missing template: ${tpl}`)
	const clone = template.content.cloneNode(true)

	;[...clone.querySelectorAll(".modal-cancel")].forEach(el => {
		el.addEventListener('click', _ => this.cancel())
		el.style.cursor="pointer"
	})

	;[...clone.querySelectorAll(".modal-submit")].forEach(el => {
		el.addEventListener('click', _ => this.submit())
	})

	;[...clone.querySelectorAll("form")].forEach(el => {
		el.addEventListener('submit', e => {
			e.preventDefault()
			if (e.submitter && e.submitter.name)
				this.submit({[e.submitter.name]: e.submitter.value})
			else
				this.submit()
		})
	})

	this.exception = exception ?? true
	this.root = document.createElement('div')
	this.root.style.width = '100%'
	this.root.style.height = '100%'
	this.root.style.position = 'fixed'
	this.root.style.top = '0'
	this.root.style.left = '0'
	this.root.style['z-index'] = '200'
	this.root.style.display = 'flex'
	this.root.style['justify-content'] = 'space-evenly'
	this.root.style['flex-direction'] = 'column'
	this.root.tabIndex = '0' // needs for key focus
	this.root.classList.add('modal-background')
	this.root.appendChild(clone)

	this.root.addEventListener("click", e => {
		if(e.target == this.root)
			this.root.dispatchEvent(new Event("cancelModal"))
	})

	this.root.addEventListener("cancelModal", _ => {
		this.root.parentNode?.removeChild(this.root)
		this.exception
			? this.onCancel(new Error("Cancelled"))
			: this.onSubmit({})
	})

	this.root.addEventListener("submitModal", event => {
		this.root.parentNode?.removeChild(this.root)
		this.onSubmit(event.detail)
	})

	if (interactive) this.root.onkeyup = e => {
		if (e.key == "Enter") this.submit()
		if (e.key == "Escape") this.cancel()
	}

	this.onCancel = _=>_
	this.onSubmit = _=>_
}

Modal.prototype.cancel = function() {
	this.root.dispatchEvent(new Event("cancelModal"))
}

Modal.prototype.submit = function(override={}) {
	const inputs = this.root.querySelectorAll("input:not([type=radio]:not(:checked)),meter,progress,select")
	const inpobj = Object.fromEntries([...inputs].map(i=>[i.name, i.value]))
	const detail = {...inpobj, ...override}
	this.root.dispatchEvent(new CustomEvent("submitModal", {detail}))
}

Modal.prototype.open = function() {
	document.body.appendChild(this.root)
	this.root.focus()
	return new Promise((res,rej) => {
		this.onSubmit = res
		this.onCancel = rej
	})
}

// Factory functions
export const createModal = tpl => new Modal(tpl)
