'use strict';

var NVG = class {
	constructor(input) {
		this.document = 'nvg';
		this.items = [];
		this.version = '2.0.2'
		if (typeof input == 'string'){
			//do stuff with input object
			try {
				input = JSON.parse(input);
				for (var key in input){
					this[key] = input[key];
				}
			}catch (e) {
				//So parse as JSON failed, try to parse it as xml
				this.parseXML(input);
			}	
		}
	}
	add(item){
		this.items.push(item);
	}
	getItems(){ //returns all items
		return this.items;
	}
	parseXML(xml){
		//parse XML string to JSON
		function parseSubNodes(nodes, items){
			for (var i = 0; i < nodes.length; i++){
				if(nodes[i].nodeType == 1){
					var item = {};
					// TODO, only set drawable for drawables...
					item.drawable = nodes[i].nodeName.split(':')[1];
					
					if(item.drawable == 'g' || item.drawable == 'composite'){
						item.items = parseSubNodes(nodes[i].childNodes, []);
					}
					// TODO Add code for creating class objects for each item type				
					Array.prototype.slice.call(nodes[i].attributes).forEach(function(attr) {
						if (attr.name == 'modifiers' || attr.name == 'style') {
							item[attr.name] = {};
							var attr_list = attr.value.trim().split(';');
							for (var j = 0; j < attr_list.length; j++){
								if(attr_list[j]){
									var s = attr_list[j].split(':');
									if(s[0] && s[1])item[attr.name][s[0].trim()] = isNaN(Number(s[1].trim()))?s[1].trim():Number(s[1].trim());
								}
							}
						return;
						}
						if (attr.name == 'points') {
							item[attr.name] = [];
							var attr_list = attr.value.trim().split(' ');
							for (var j = 0; j < attr_list.length; j++){
								if(attr_list[j]){
									var s = attr_list[j].split(',');
									if(s[0] && s[1])item[attr.name].push([Number(s[0]),Number(s[1])]);
								}
							}
						return;
						}
    					item[attr.name] = isNaN(Number(attr.value))?attr.value:Number(attr.value);
						
					});
					items.push(item);
				}
			}
			return items;
		}
		
		var xml = (new DOMParser()).parseFromString(xml , "text/xml");
		if(xml.firstChild.nodeName.split(':')[1] == 'nvg'){//check that we actually are parsing NVG but ignore namespace
			this.version = xml.firstChild.getAttribute('version');
			var nodes = xml.firstChild.childNodes;
			this.items = parseSubNodes(nodes, []);	
		}		
	}
	toGeoJSON(){
		//parse this to GeoJSON
	}
	toXML(){
		//parse this to NVG XML
	}
	
};

/*
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
*/
/*
NVG.ContentItem = class {
	constructor(xml, uri) {
		this.drawable = 'content-item';
		this.uri = uri;
	}
};
*/
/*
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
};*/