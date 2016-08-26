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
				var nodeName = node.nodeName.split(':');
				if(nodeName[0] == 'dc' || nodeName[0] == 'dcterms'){
					nodeName = nodeName[0];
				}else{
					nodeName = nodeName[1];
				}
				if(node.nodeType == 1 && nodeName){
					nodeName = nodeName.toLowerCase();
					switch (nodeName) {
						case 'begin':
							current[nodeName] = node.textContent;
							break;
						case 'end':
							current[nodeName] = node.textContent;
							break;
						case 'dc':
						case 'dcterms':
							current[node.nodeName] = node.textContent;
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
						case 'metadata':
							current[nodeName] = {};
							tagAttributes(node.childNodes, current[nodeName]);
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
							//Debug logging, remove later
							if(['arc','arcband','arrow','circle','composite','content-item','corridor','ellipse','g','multipoint','orbit','point','polygon','polyline','rect','text'].lastIndexOf(nodeName) == -1){
								console.log('TODO tagAttributes default: ' + nodeName);	
							}
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
					var nodeName = node.nodeName.split(':')[1] || node.nodeName;
					nodeName = nodeName.toLowerCase();
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
		if(xml.firstChild.nodeName == 'nvg' || xml.firstChild.nodeName.split(':')[1] == 'nvg'){//check that we actually are parsing NVG but ignore namespace
			this.version = xml.firstChild.getAttribute('version'); 
			this.items = [];
			var nodes = xml.firstChild.childNodes;
			parseSubNodes(nodes, this);				
		}		
	}
	toGeoJSON(){
		//parse this to GeoJSON
		function distBearing(point, dist, bearing){
			var angularDist = dist/6371e3;
			var bearing = bearing * (Math.PI/180);
			var lng = point[0] * (Math.PI/180);
			var lat = point[1] * (Math.PI/180);
			//console.log(lng + ' ' + lat)
			var lat2 = Math.asin(Math.sin(lat)*Math.cos(angularDist)+Math.cos(lat)*Math.sin(angularDist)*Math.cos(bearing));
			var lng2 = (lng+Math.atan2(Math.sin(bearing)*Math.sin(angularDist)*Math.cos(lat),Math.cos(angularDist)-Math.sin(lat)*Math.sin(lat2)));
			lat2 = lat2/(Math.PI/180);
			lng2 = ((lng2/(Math.PI/180))+540)%360-180;
			return [lng2,lat2];
		}
		
		function items2features(items, geometrycollection){
			var features = [];
			for (var i = 0; i < items.length; i++){
				var item = items[i];
				var feature = { "type": "Feature", "properties" : {}};
				for (var key in item){
					if(key == 'uri'){
						feature.id = item.uri;
					}else{
						feature.properties[key] = item[key];
					}
				}
				switch (item.drawable) {
					case 'arc':
						feature.geometry = {"type": "LineString"};
						//feature.geometries = items2features(item.items);
						//create line
						break;
					case 'arcband':
						feature.geometry = {"type": "Polygon"};
						//feature.geometries = items2features(item.items);
						//create polygon
						break;
					case 'arrow':
						feature.geometry = {"type": "Polygon"};
						//feature.geometries = items2features(item.items, true);
						//create polygon
						break;
					case 'circle':
						feature.geometry = {"type": "Polygon"};
						feature.geometry.coordinates = [[]];
						for (var i = 0; i <= 360; i++){
							feature.geometry.coordinates[0].push(distBearing([item.cx,item.cy], item.r, i));
						}
						break;
					case 'composite':
						feature.geometry = {"type": "GeometryCollection"};
						feature.geometry.geometries = items2features(item.items, true);
						delete feature.properties.items;
						break;
					case 'corridor':
						feature.geometry = {"type": "Polygon"};
						//feature.geometries = items2features(item.items);
						//create polygon
						break;
					case 'ellipse':
						feature.geometry = {"type": "Polygon"};
						//feature.geometries = items2features(item.items);
						//create polygon
						break;
					case 'g':
						feature.geometry = {"type": "GeometryCollection"};
						feature.geometry.geometries = items2features(item.items, true);
						delete feature.properties.items;
						break;
					case 'multipoint':
						feature.geometry = {"type": "MultiPoint"};
						feature.geometry.coordinates = item.points;
						delete feature.properties.points;
						break;
					case 'orbit':
						feature.geometry = {"type": "Polygon"};
						//feature.geometries = items2features(item.items);
						//create polygon
						break;
					case 'point':
						feature.geometry = {"type": "Point"};
						feature.geometry.coordinates = [item.x, item.y];
						break;
					case 'polygon':
						feature.geometry = {"type": "Polygon"};
						feature.geometry.coordinates = [item.points];
						delete feature.properties.points;
						break;
					case 'polyline':
						feature.geometry = {"type": "LineString"};
						feature.geometry.coordinates = item.points;
						delete feature.properties.points;
						break;
					case 'rect':
						feature.geometry = {"type": "Polygon"};
						//feature.geometries = items2features(item.items);
						//create polygon
						break;
					case 'text':
						feature.geometry = {"type": "Point"};
						feature.geometry.coordinates = [item.x, item.y];
						break;
					default:
						console.log('TODO parse item default: ' + item.drawable)
				}
				if(geometrycollection){
					//If this is part of a geometry collection we can't have a normal feature
					if(feature.id)feature.geometry.id = feature.id;
					feature.geometry.properties = feature.properties;					
					features.push(feature.geometry);
				}else{
					features.push(feature);
				}
			}
			return features;
		}
		
		var geoJSON = {};
		geoJSON.type = 'FeatureCollection';
		for (var key in this){
			if(key == 'items'){
				geoJSON.features = items2features(this.items);
			}else{
				geoJSON[key] = this[key];
			}
		}
		
		return geoJSON;
	}
	toXML(){
		//parse this to NVG XML
	}
	
};
