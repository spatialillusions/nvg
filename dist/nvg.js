'use strict';

var NVG = class {
	constructor(input) {
		this.document = 'nvg';
		this.items = [];
		this.version = '2.0.2'
		if (typeof input == "object"){
			//do stuff with input object
		}
		if (typeof input == "string"){
			//do stuff with input XML string
		}
	}
	getItems(){ //returns all items
		return this.items;
	}
	read(xml){
		//parse XML string to JSON
	}
	toGeoJSON(){
		//parse this to GeoJSON
	}
	toXML(){
		//parse this to NVG XML
	}
	
};

NVG.Text = class {
	constructor(x,y,content) {
		this.drawable = 'text';
		this.x = x;
		this.y = y;
		this.content = content;
	}
};

NVG.Point = class {
	constructor(xml) {
		this.drawable = 'point';
	}
};

NVG.Multipoint = class {
	constructor(xml) {
		this.drawable = 'multipoint';
	}
};

NVG.Circle = class {
	constructor(xml) {
		this.drawable = 'circle';
	}
};

NVG.Ellipse = class {
	constructor(xml) {
		this.drawable = 'ellipse';
	}
};

NVG.Rect = class {
	constructor(xml) {
		this.drawable = 'rect';
	}
};

NVG.Polyline = class {
	constructor(xml) {
		this.drawable = 'polyline';
	}
};

NVG.Arrow = class {
	constructor(xml) {
		this.drawable = 'arrow';
	}
};

NVG.Corridor = class {
	constructor(xml) {
		this.drawable = 'corridor';
	}
};

NVG.Orbit = class {
	constructor(xml) {
		this.drawable = 'orbit';
	}
};

NVG.Polygon = class {
	constructor(xml) {
		this.drawable = 'polygon';
	}
};

NVG.Arc = class {
	constructor(xml) {
		this.drawable = 'arc';
	}
};

NVG.Arcband = class {
	constructor(xml) {
		this.drawable = 'arcband';
	}
};

NVG.ContentItem = class {
	constructor(xml) {
		this.drawable = 'content-item';
	}
};

NVG.Group = class {
	constructor(xml) {
		this.drawable = 'g';
		this.items = [];
	}
	getItems(){
		return this.items;
	}
};

NVG.Composite = class {
	constructor(xml) {
		this.drawable = 'composite';
	}
};
