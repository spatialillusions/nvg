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
	getItems(){ //returns all items
		return this.items;
	}
	parseXML(xml){
		//parse XML string to JSON
		function tagAttributes(nodes, current){
			for (var i = 0; i < nodes.length; i++){
				var node = nodes[i];
				var nodeName = node.nodeName.split(':')[1];
				if(node.nodeType == 1 && nodeName &&
				//Do not try to get drawables as attributes
				['arc','arcband','arrow','circle','composite','content-item','corridor','ellipse','g','multipoint','orbit','point','polygon','polyline','rect','text'].lastIndexOf(nodeName) == -1){
					nodeName = nodeName.toLowerCase();
					switch (nodeName) {
						case 'begin':
							current[nodeName] = node.textContent;
							break;
						case 'end':
							current[nodeName] = node.textContent;
							break;
						case 'content':
							current[nodeName] = node.textContent;
							break;
						case 'exclude':
							if (!current.hasOwnProperty(nodeName)){
								current.exclusion = [];
							}
							tagAttributes(node.childNodes, current.exclusion);
							break;
						case 'extendeddata':
							if (!current.hasOwnProperty(nodeName)){
								current[nodeName] = {};
								current[nodeName].simpledata = [];
							}
							nodeAttibutes(node, current[nodeName]);
							parseSubNodes(node.childNodes, current[nodeName]);
							break;
						case 'extension':
							console.log('TODO tagAttributes: '  + nodeName);
							// TODO How to handle extended data
							current[nodeName] = [];//this is for node 
							break;
						case 'textinfo':
							current[nodeName] = node.textContent;
							break;
						case 'timespan':
							current[nodeName] = {};
							tagAttributes(node.childNodes, current[nodeName]);
							break;
						case 'timestamp':
							current[nodeName] = node.textContent;
							break;
						case 'simplefield':
							if (!current.hasOwnProperty(nodeName)){
								current[nodeName] = [];
							}
							var field = {};
							nodeAttibutes(node, field);
							current[nodeName].push(field);
							break;
						case 'arcband-ring':
						case 'circular-ring':
						case 'elliptic-ring':
						case 'linear-ring':
						case 'rect-ring':
							var exclude = {};
							exclude.drawable = nodeName.replace('-','');
							nodeAttibutes(node, exclude);
							current.push(exclude);
							break;
						default:
							console.log('TODO tagAttributes default: ' + nodeName);	
					}
				}
			}
		}
		function nodeAttibutes(node, current){
			Array.prototype.slice.call(node.attributes).forEach(function(attr) {
				if (attr.name == 'modifiers' || attr.name == 'style') {
					current[attr.name] = {};
					var attr_list = attr.value.trim().split(';');
					for (var j = 0; j < attr_list.length; j++){
						if(attr_list[j]){
							var s = attr_list[j].split(':');
							if(s[0] && s[1])current[attr.name][s[0].trim()] = isNaN(Number(s[1].trim()))?s[1].trim():Number(s[1].trim());
						}
					}
				return;
				}
				if (attr.name == 'points') {
					current[attr.name] = [];
					var attr_list = attr.value.trim().split(' ');
					for (var j = 0; j < attr_list.length; j++){
						if(attr_list[j]){
							var s = attr_list[j].split(',');
							if(s[0] && s[1])current[attr.name].push([Number(s[0]),Number(s[1])]);
						}
					}
				return;
				}
				current[attr.name] = isNaN(Number(attr.value))?attr.value:Number(attr.value);
			});
		}
		function parseSubNodes(nodes, current){
			for (var i = 0; i < nodes.length; i++){
				var node = nodes[i];
				if(node.nodeType == 1){
					var nodeName = node.nodeName.split(':')[1].toLowerCase();
					var item = {};
					if (['extendeddata','extension','metadata','schema','section','simpledata','simplefield'].lastIndexOf(nodeName) != -1){			
						
						switch (nodeName) {
							case 'extendeddata':
								current[nodeName] = item;
								nodeAttibutes(node, item);
								tagAttributes(node.childNodes, item);
								break;
							case 'extension':
								console.log('TODO parsesubnodes: ' + nodeName)
								// TODO How to handle extended data
								current[nodeName] = [];//this is for root level
								break;
							case 'metadata':
								console.log('TODO parsesubnodes: ' + nodeName)
								// TODO How to handle metadata data
								current[nodeName] = item;
								break;
							case 'schema':
								if (!current.hasOwnProperty(nodeName)){
									current[nodeName] = [];
								}
								current[nodeName].push(item);
								nodeAttibutes(node, item);
								tagAttributes(node.childNodes, item);
								break;
							case 'section':
								if (!current.hasOwnProperty('simpledatasection')){
									current.simpledatasection = [];
								}
								current.simpledatasection.push(item);
								nodeAttibutes(node, item);
								item.simpledata = [];
								parseSubNodes(node.childNodes, item);
								break;
							case 'simpledata':
								nodeAttibutes(node, item);
								item.value = node.textContent;
								current.simpledata.push(item);
								tagAttributes(node.childNodes, item);
								break;
							case 'simplefield':
								current[nodeName] = item;
								nodeAttibutes(node, item);
								tagAttributes(node.childNodes, item);
								break;
							default:
								console.log('TODO parsesubnodes default: ' + nodeName)
						}
					}else{ //This is all drawables
						nodeAttibutes(node, item);
						item.drawable = nodeName;
						
						if(node.childNodes.length){
							tagAttributes(node.childNodes, item);
						}
						if(item.drawable == 'g' || item.drawable == 'composite'){
							item.items = [];
							parseSubNodes(node.childNodes, item);
						}
						current.items.push(item);					
					}
				}
			}
		}
		
		var xml = (new DOMParser()).parseFromString(xml , "text/xml");
		if(xml.firstChild.nodeName.split(':')[1] == 'nvg'){//check that we actually are parsing NVG but ignore namespace
			this.version = xml.firstChild.getAttribute('version'); 
			this.items = [];
			var nodes = xml.firstChild.childNodes;
			parseSubNodes(nodes, this);				
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