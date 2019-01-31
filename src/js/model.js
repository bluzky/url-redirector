import { uuid, store } from './util';

export default class RuleDb {
	constructor(key, sub) {
		this.key = key;
		this.rules = store(key) || [];
		this.onChanges = [sub];
	}

	inform() {
		store(this.key, this.todos);
		this.onChanges.forEach( cb => cb() );
	}

	create(from, to) {
		this.rules = this.rules.concat({
			id: uuid(),
			from,
      to
		});
		this.inform();
	}

	destroy(rule) {
		this.rules = this.rules.filter( t => t !== rule );
		this.inform();
	}

	save(ruleToSave, from, to) {
		this.rules = this.rules.map( rule => (
			rule !== ruleToSave ? rule : ({ ...rule, from, to })
		));
		this.inform();
	}
}
