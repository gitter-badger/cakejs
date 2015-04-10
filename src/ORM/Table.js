export class Table {
	constructor(){
		this._hasOne = [];
		this._hasMany = [];
		this._belongsTo = [];
		this._belongsToMany = [];
		this._behaviours = [];
		this.initalize();
	}
	initialize(){}
}