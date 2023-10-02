.node_modules
.env
node_modulesvar config={};
config.serial={};
config.serial.port=process.env.MESH_SERIAL_PORT || '/dev/ttyUSB1';//'/dev/ttyUSB1';
config.serial.baud=process.env.MESH_SERIAL_BAUD || 115200;

exports.config=config;