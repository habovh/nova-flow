class InformationView {
	constructor() {
		this._treeView = new TreeView('io.becker.Flow.sidebar.info', {
			dataProvider: this,
		});
		
		console.log('constructor')
		
		this.getChildren = this.getChildren.bind(this);
		this.getTreeItem = this.getTreeItem.bind(this);
	}
	
	_statusElement = {
		title: "Status",
		value: "Inactive",
		identifier: "status",
		image: "__builtin.path",
	};
	
	set status(value) {
		this._statusElement.value = value;
		this._treeView.reload(this._statusElement);
	}
	
	reload() {
		this._treeView.reload();
	}
	
	getChildren(element) {
		if (element === null) {
			return [this._statusElement];
		}
		return [];
	}
	
	getTreeItem(element) {
		const item = new TreeItem(element.title, TreeItemCollapsibleState.None);
		item.descriptiveText = element.value;
		item.identifier = element.identifier;
		item.image = element.image;
		return item;
	}
	
	dispose() {
		this.status = "Disposed";
		this._treeView.dispose();
	}
}

module.exports = InformationView
