# nvg
Javascript library for Nato Vector Graphics

![Sample Output on Open Layers Map](docs/sample.xml.png?raw=true)

## About Nato Vector Graphics

The best resource for information about NVG is at TidepediA https://tide.act.nato.int/tidepedia/index.php/NATO_Vector_Graphics_(NVG)
(To get access to the site you will have to request a login.)

At TidepediA you will find all documentation about NVG including sample files and schemas for XML and JSON.

## Usage

### new NVG(input)
Create a new NVG object by using `new NVG(input)` where input is optional and is NVG as strings in XML or JSON format, it can also be a single item object or an array of items (`see getItem()`).

The NVG object has the following methods.

#### getItem(uri)

Returns the item with a specified uri. (If uri is not provided it will return all items.)

#### parseXML(XML)

This reads a XML string and parses this to the NVG object.

#### toGeoJSON()

This outputs the NVG object as GeoJSON.


## Limitations

 - The library uses a sphere aproximation of the earth when it calculates some geometries as GeoJSON and this gives an error up to 0.5%, or 5m in 1km distances.
 
 - The library does convert some NVG elements to shapes for GeoJSON output, converting circles to polygons is one example, but does not draw other tactical graphics. The library can however be used together with milsymbol or mil-sym-js to draw tactical symbology to a webmap.

## License and Contact
The library is developed by Måns Beckman, www.spatialillusions.com, and is provided under a MIT License.