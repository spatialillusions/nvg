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


NVG.Arc = class {
	constructor(cx,cy,rx,ry,startangle,endangle, uri, properties) {
		this.drawable = 'arc';
		this.uri = uri;
		
		if(properties){
			for (key in properties){
				this[key] = properties[key];
			}
		}
	}
};

NVG.Arcband = class {
	constructor(cx,cy,minr,maxr,startangle,endangle, uri, properties) {
		this.drawable = 'arcband';
		this.uri = uri;
		
		if(properties){
			for (key in properties){
				this[key] = properties[key];
			}
		}
	}
};

NVG.Arrow = class {
	constructor(width, points, uri, properties) {
		this.drawable = 'arrow';
		this.uri = uri;
		
		if(properties){
			for (key in properties){
				this[key] = properties[key];
			}
		}
		
	}
};

NVG.Circle = class {
	constructor(cx, cy, r, uri, properties) {
		this.drawable = 'circle';
		this.uri = uri;
		
		if(properties){
			for (key in properties){
				this[key] = properties[key];
			}
		}
		
	}
};

NVG.Composite = class {
	constructor(items, uri, properties) {
		this.drawable = 'composite';
		this.uri = uri;
		
		if(properties){
			for (key in properties){
				this[key] = properties[key];
			}
		}
	}
};
/*
NVG.ContentItem = class {
	constructor(xml, uri) {
		this.drawable = 'content-item';
		this.uri = uri;
	}
};
*/
NVG.Corridor = class {
	constructor(width, points, uri, properties) {
		this.drawable = 'corridor';
		this.uri = uri;
		
		if(properties){
			for (key in properties){
				this[key] = properties[key];
			}
		}
		
	}
};

NVG.Ellipse = class {
	constructor(cx,cy,rx,ry, uri, properties) {
		this.drawable = 'ellipse';
		this.uri = uri;
		
		if(properties){
			for (key in properties){
				this[key] = properties[key];
			}
		}
		
	}
};

NVG.Group = class {
	constructor(items, properties) {
		this.drawable = 'g';
		this.items = items;
		
		if(properties){
			for (key in properties){
				this[key] = properties[key];
			}
		}
	}
	getItems(){
		return this.items;
	}
};

NVG.Multipoint = class {
	constructor(points, uri, properties) {
		this.drawable = 'multipoint';
		this.uri = uri;
		
		if(properties){
			for (key in properties){
				this[key] = properties[key];
			}
		}
		
	}
};

NVG.Orbit = class {
	constructor(width, points, uri, properties) {
		this.drawable = 'orbit';
		this.uri = uri;
		
		if(properties){
			for (key in properties){
				this[key] = properties[key];
			}
		}
	}
};

NVG.Point = class {
	constructor(x, y, uri, properties) {
		this.drawable = 'point';
		this.uri = uri;
		
		if(properties){
			for (key in properties){
				this[key] = properties[key];
			}
		}
	}
};

NVG.Polygon = class {
	constructor(points, uri, properties) {
		this.drawable = 'polygon';
		this.uri = uri;
		
		if(properties){
			for (key in properties){
				this[key] = properties[key];
			}
		}
	}
};

NVG.Polyline = class {
	constructor(points, uri, properties) {
		this.drawable = 'polyline';
		this.uri = uri;
		
		if(properties){
			for (key in properties){
				this[key] = properties[key];
			}
		}	
	}
};

NVG.Rect = class {
	constructor(cx,cy,rx,ry, uri, properties) {
		this.drawable = 'rect';
		this.uri = uri;
		
		if(properties){
			for (key in properties){
				this[key] = properties[key];
			}
		}
	}
};

NVG.Text = class {
	constructor(x,y,content,uri, properties) {
		this.x = x;
		this.y = y;
		this.content = content;
		
		this.drawable = 'text';
		this.uri = uri;
		
		if(properties){
			for (key in properties){
				this[key] = properties[key];
			}
		}
	}
};