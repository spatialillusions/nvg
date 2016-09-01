# nvg
Javascript library for Nato Vector Graphics

![Sample Output on Open Layers Map](docs/sample.xml.png?raw=true)

## About Nato Vector Graphics

The best resource for information about NVG is at TidepediA https://tide.act.nato.int/tidepedia/index.php/NATO_Vector_Graphics_(NVG)
(To get access to the site you will have to request a login.)

At TidepediA you will find all documentation about NVG including sample files and schemas for XML and JSON.

## Usage

### new NVG(input)
Create a new NVG object by using `new NVG(input)` where input is optional and is NVG in XML or JSON format.

The NVG object has the following methods.

#### parseXML(XML)

This reads a XML string and parses this to the NVG object.

#### toGeoJSON()

This outputs the NVG object as GeoJSON.


## Limitations

 - The library uses a sphere aproximation of the earth when it calculates some geometries as GeoJSON and this gives an error up to 0.5%, or 5m in 1km distances.

## License and Contact
The library is developed by Måns Beckman, www.spatialillusions.com, and is provided under a MIT License.