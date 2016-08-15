var NVG = class {
	constructor(xml) {
		this.document = 'nvg';
		this.items = [];
		this.version = '2.0.2'
	}
	read(xml){console.log('reading')}
	toGeoJSON(){
		//parse to GeoJSON
	}
	toXML(){
		//parse to NVG XML
	}
	
};

NVG.Text = class {
	constructor(xml) {
		this.drawable = 'text';
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
};

NVG.Composite = class {
	constructor(xml) {
		this.drawable = 'composite';
	}
};


parser = new NVG();
console.log(parser);
parser.items.push(new NVG.Group)
console.log(parser);